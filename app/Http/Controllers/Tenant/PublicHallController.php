<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PublicHallController extends Controller
{
    public function show(): Response
    {
        abort_unless(tenant('status') === 'active', 404);

        $reservations = Reservation::query()
            ->where('status', '!=', 'cancelled')
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date')
            ->limit(8)
            ->get(['id', 'client_name', 'event_date', 'status']);

        return Inertia::render('Public/Hall', [
            'tenant' => $this->tenantPayload(),
            'marketplaceUrl' => $this->centralUrl(),
            'services' => $this->serviceOptions(),
            'reservations' => $reservations->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'client_name' => $reservation->client_name,
                'event_date' => optional($reservation->event_date)->toDateString(),
                'status' => $reservation->status,
            ]),
            'unavailableDates' => $reservations
                ->pluck('event_date')
                ->map(fn ($date) => $date->toDateString())
                ->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(tenant('status') === 'active', 404);

        $data = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'service_items' => ['nullable', 'array'],
            'service_items.*.service_id' => [
                'required',
                Rule::exists('services', 'id')
                    ->where('tenant_id', tenant('id'))
                    ->where('is_active', true),
            ],
            'service_items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $alreadyReserved = Reservation::query()
            ->where('event_date', $data['event_date'])
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($alreadyReserved) {
            throw ValidationException::withMessages([
                'event_date' => 'Cette date est deja demandee ou reservee pour cette salle.',
            ]);
        }

        $serviceLines = $this->buildServiceLines($data['service_items'] ?? []);
        $servicesTotal = $this->serviceLinesTotal($serviceLines);

        DB::transaction(function () use ($data, $serviceLines, $servicesTotal) {
            $client = Client::query()
                ->where(function ($query) use ($data) {
                    $query->where('phone', $data['phone']);

                    if ($data['email'] ?? null) {
                        $query->orWhere('email', $data['email']);
                    }
                })
                ->first();

            if ($client) {
                $client->update([
                    'name' => $data['client_name'],
                    'email' => $data['email'] ?? $client->email,
                    'phone' => $data['phone'],
                    'notes' => $this->clientNotes($data['notes'] ?? null),
                ]);
            } else {
                $client = Client::create([
                    'name' => $data['client_name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'],
                    'notes' => $this->clientNotes($data['notes'] ?? null),
                ]);
            }

            $reservation = Reservation::create([
                'client_id' => $client->id,
                'client_name' => $client->name,
                'event_date' => $data['event_date'],
                'status' => 'pending',
                'location_price' => 0,
                'services_total' => $servicesTotal,
                'total_price' => $servicesTotal,
                'advance_amount' => 0,
            ]);

            $this->syncReservationServices($reservation, $serviceLines);
        });

        return redirect()
            ->route('public.hall.show')
            ->with('success', 'Votre demande a ete envoyee. La salle vous contactera pour confirmer les details.');
    }

    protected function tenantPayload(): array
    {
        $tenant = Tenant::query()->with('photos')->findOrFail(tenant('id'));

        return [
            'id' => $tenant->id,
            'name' => $tenant->name,
            'plan' => $tenant->plan,
            'status' => $tenant->status,
            'domain' => request()->getHost(),
            'wilaya' => $tenant->wilaya,
            'commune' => $tenant->commune,
            'address' => $tenant->address,
            'gps_latitude' => $tenant->gps_latitude,
            'gps_longitude' => $tenant->gps_longitude,
            'phone_primary' => $tenant->phone_primary,
            'phone_secondary' => $tenant->phone_secondary,
            'capacity_max' => $tenant->capacity_max,
            'has_separated_spaces' => $tenant->has_separated_spaces,
            'parking_capacity' => $tenant->parking_capacity,
            'has_generator' => $tenant->has_generator,
            'has_air_conditioning' => $tenant->has_air_conditioning,
            'allow_outside_caterer' => $tenant->allow_outside_caterer,
            'instagram_url' => $tenant->instagram_url,
            'tiktok_url' => $tenant->tiktok_url,
            'photos' => $tenant->photos->map(fn ($photo) => [
                'id' => $photo->id,
                'url' => \Illuminate\Support\Facades\Storage::disk('public')->url($photo->path),
            ])->values(),
        ];
    }

    protected function clientNotes(?string $notes): string
    {
        $prefix = 'Demande publique marketplace';

        return trim($prefix.($notes ? ' - '.$notes : ''));
    }

    protected function serviceOptions()
    {
        return Service::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'pricing_type', 'price'])
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'pricing_type' => $service->pricing_type,
                'price' => (float) $service->price,
            ]);
    }

    protected function buildServiceLines(array $items): array
    {
        $normalized = collect($items)
            ->map(fn ($item) => [
                'service_id' => (int) ($item['service_id'] ?? 0),
                'quantity' => max(1, (int) ($item['quantity'] ?? 1)),
            ])
            ->filter(fn ($item) => $item['service_id'] > 0)
            ->keyBy('service_id');

        if ($normalized->isEmpty()) {
            return [];
        }

        $services = Service::query()
            ->where('is_active', true)
            ->whereIn('id', $normalized->keys())
            ->get()
            ->keyBy('id');

        return $normalized
            ->map(function ($item, int $serviceId) use ($services) {
                $service = $services->get($serviceId);

                if (! $service) {
                    return null;
                }

                $quantity = $item['quantity'];
                $unitPrice = (float) $service->price;
                $subtotal = $service->pricing_type === 'quote' ? 0 : $unitPrice * $quantity;

                return [
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'pricing_type' => $service->pricing_type,
                    'unit_price' => $unitPrice,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    protected function serviceLinesTotal(array $serviceLines): float
    {
        return (float) collect($serviceLines)->sum('subtotal');
    }

    protected function syncReservationServices(Reservation $reservation, array $serviceLines): void
    {
        foreach ($serviceLines as $serviceLine) {
            $reservation->reservationServices()->create([
                ...$serviceLine,
                'tenant_id' => tenant('id'),
            ]);
        }
    }

    protected function centralUrl(): string
    {
        $domain = parse_url((string) config('app.url'), PHP_URL_HOST)
            ?: (collect(config('tenancy.central_domains', []))
                ->first(fn (string $centralDomain) => $centralDomain !== '127.0.0.1') ?? 'localhost');
        $port = request()->getPort();
        $portSegment = in_array($port, [80, 443], true) ? '' : ':'.$port;

        return request()->getScheme().'://'.$domain.$portSegment.'/';
    }
}
