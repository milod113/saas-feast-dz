<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\Service;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class HallPreviewController extends Controller
{
    public function show(Tenant $tenant): Response
    {
        abort_unless($tenant->status === 'active', 404);

        $reservations = Reservation::withoutTenancy()
            ->where('tenant_id', $tenant->id)
            ->where('status', '!=', 'cancelled')
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date')
            ->limit(8)
            ->get(['id', 'client_name', 'event_date', 'status']);

        return Inertia::render('Public/Hall', [
            'tenant' => $this->tenantPayload($tenant),
            'marketplaceUrl' => route('central.home'),
            'bookingActionUrl' => route('central.halls.booking.store', $tenant->id),
            'services' => $this->serviceOptions($tenant),
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

    public function store(Request $request, Tenant $tenant): RedirectResponse
    {
        abort_unless($tenant->status === 'active', 404);

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
                    ->where('tenant_id', $tenant->id)
                    ->where('is_active', true),
            ],
            'service_items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $alreadyReserved = Reservation::withoutTenancy()
            ->where('tenant_id', $tenant->id)
            ->where('event_date', $data['event_date'])
            ->where('status', '!=', 'cancelled')
            ->exists();

        if ($alreadyReserved) {
            throw ValidationException::withMessages([
                'event_date' => 'Cette date est deja demandee ou reservee pour cette salle.',
            ]);
        }

        $serviceLines = $this->buildServiceLines($tenant, $data['service_items'] ?? []);
        $servicesTotal = $this->serviceLinesTotal($serviceLines);

        DB::transaction(function () use ($tenant, $data, $serviceLines, $servicesTotal) {
            $client = Client::withoutTenancy()
                ->where('tenant_id', $tenant->id)
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
                $client = Client::withoutTenancy()->create([
                    'tenant_id' => $tenant->id,
                    'name' => $data['client_name'],
                    'email' => $data['email'] ?? null,
                    'phone' => $data['phone'],
                    'notes' => $this->clientNotes($data['notes'] ?? null),
                ]);
            }

            $reservation = Reservation::withoutTenancy()->create([
                'tenant_id' => $tenant->id,
                'client_id' => $client->id,
                'client_name' => $client->name,
                'event_date' => $data['event_date'],
                'status' => 'pending',
                'location_price' => 0,
                'services_total' => $servicesTotal,
                'total_price' => $servicesTotal,
                'advance_amount' => 0,
            ]);

            foreach ($serviceLines as $serviceLine) {
                $reservation->reservationServices()->create([
                    ...$serviceLine,
                    'tenant_id' => $tenant->id,
                ]);
            }
        });

        return redirect()
            ->route('central.halls.show', $tenant->id)
            ->with('success', 'Votre demande a ete envoyee. La salle vous contactera pour confirmer les details.');
    }

    protected function tenantPayload(Tenant $tenant): array
    {
        $tenant->loadMissing('photos', 'domains');

        return [
            'id' => $tenant->id,
            'name' => $tenant->name,
            'plan' => $tenant->plan,
            'status' => $tenant->status,
            'domain' => $tenant->domains->first()?->domain,
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
                'url' => Storage::disk('public')->url($photo->path),
            ])->values(),
        ];
    }

    protected function clientNotes(?string $notes): string
    {
        $prefix = 'Demande publique marketplace';

        return trim($prefix.($notes ? ' - '.$notes : ''));
    }

    protected function serviceOptions(Tenant $tenant)
    {
        return Service::withoutTenancy()
            ->where('tenant_id', $tenant->id)
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

    protected function buildServiceLines(Tenant $tenant, array $items): array
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

        $services = Service::withoutTenancy()
            ->where('tenant_id', $tenant->id)
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
}
