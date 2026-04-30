<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ReservationController extends Controller
{
    public function index(Request $request): Response
    {
        $status = (string) $request->string('status');

        $reservations = Reservation::query()
            ->with('client:id,name,phone,email')
            ->with('payments:id,reservation_id,amount')
            ->with('reservationServices:id,reservation_id,service_name,quantity,subtotal')
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderBy('event_date')
            ->get([
                'id',
                'client_id',
                'client_name',
                'event_date',
                'status',
                'location_price',
                'services_total',
                'total_price',
                'advance_amount',
                'created_at',
            ]);

        return Inertia::render('Tenant/Reservations/Index', [
            'filters' => [
                'status' => $status,
            ],
            'reservations' => $reservations,
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Tenant/Reservations/Create', [
            'clients' => $this->clientOptions(),
            'statuses' => $this->statuses(),
            'services' => $this->serviceOptions(),
            'unavailableDates' => $this->unavailableDates(),
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateReservation($request, null, true);
        $this->assertDateAvailability($data['event_date'], null, $data['status']);
        $client = $this->resolveReservationClient($data);
        $serviceLines = $this->buildServiceLines($data['service_items'] ?? []);
        $servicesTotal = $this->serviceLinesTotal($serviceLines);
        $totalPrice = (float) $data['location_price'] + $servicesTotal;

        if ((float) ($data['initial_payment_amount'] ?? 0) - $totalPrice > 0.00001) {
            throw ValidationException::withMessages([
                'initial_payment_amount' => 'Le premier paiement ne peut pas depasser le total de la reservation.',
            ]);
        }

        DB::transaction(function () use ($client, $data, $serviceLines, $servicesTotal, $totalPrice): void {
            $reservation = Reservation::create([
                'client_id' => $client->id,
                'client_name' => $client->name,
                'event_date' => $data['event_date'],
                'status' => $data['status'],
                'location_price' => $data['location_price'],
                'services_total' => $servicesTotal,
                'total_price' => $totalPrice,
                'advance_amount' => 0,
            ]);

            $this->syncReservationServices($reservation, $serviceLines);

            if ((float) ($data['initial_payment_amount'] ?? 0) > 0) {
                Payment::create([
                    'reservation_id' => $reservation->id,
                    'amount' => $data['initial_payment_amount'],
                    'payment_date' => $data['initial_payment_date'] ?: $data['event_date'],
                    'payment_method' => $data['initial_payment_method'] ?? 'cash',
                    'notes' => 'Paiement initial ajoute lors de la creation de la reservation.',
                ]);
            }
        });

        return redirect()
            ->route('tenant.reservations.index')
            ->with('success', 'Reservation creee avec succes.');
    }

    public function edit(Reservation $reservation): Response
    {
        $reservation->load([
            'client:id,name,phone,email',
            'payments:id,reservation_id,amount',
            'reservationServices:id,reservation_id,service_id,service_name,pricing_type,unit_price,quantity,subtotal',
        ]);

        return Inertia::render('Tenant/Reservations/Edit', [
            'reservation' => [
                'id' => $reservation->id,
                'client_id' => $reservation->client_id,
                'client_name' => $reservation->client_name,
                'event_date' => optional($reservation->event_date)->format('Y-m-d'),
                'status' => $reservation->status,
                'location_price' => (string) ($reservation->location_price ?: $reservation->total_price),
                'services_total' => (string) $reservation->services_total,
                'total_price' => (string) $reservation->total_price,
                'paid_amount' => (string) $reservation->paid_amount,
                'remaining_balance' => (string) $reservation->remaining_balance,
                'payment_status' => $reservation->payment_status,
                'services' => $reservation->reservationServices->map(fn ($line) => [
                    'id' => $line->id,
                    'service_id' => $line->service_id,
                    'service_name' => $line->service_name,
                    'pricing_type' => $line->pricing_type,
                    'unit_price' => (float) $line->unit_price,
                    'quantity' => $line->quantity,
                    'subtotal' => (float) $line->subtotal,
                ])->values(),
            ],
            'clients' => $this->clientOptions(),
            'statuses' => $this->statuses(),
            'services' => $this->serviceOptions(),
            'unavailableDates' => $this->unavailableDates($reservation),
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function update(Request $request, Reservation $reservation): RedirectResponse
    {
        $data = $this->validateReservation($request, $reservation, false);
        $this->assertDateAvailability($data['event_date'], $reservation, $data['status']);
        $client = Client::findOrFail($data['client_id']);
        $serviceLines = $this->buildServiceLines($data['service_items'] ?? []);
        $servicesTotal = $this->serviceLinesTotal($serviceLines);
        $totalPrice = (float) $data['location_price'] + $servicesTotal;

        $reservation->loadMissing('payments:id,reservation_id,amount');

        if ($totalPrice + 0.00001 < (float) $reservation->paid_amount) {
            throw ValidationException::withMessages([
                'location_price' => 'Le total de la reservation ne peut pas etre inferieur aux paiements deja enregistres.',
            ]);
        }

        DB::transaction(function () use ($reservation, $client, $data, $serviceLines, $servicesTotal, $totalPrice): void {
            $reservation->update([
                'client_id' => $client->id,
                'client_name' => $client->name,
                'event_date' => $data['event_date'],
                'status' => $data['status'],
                'location_price' => $data['location_price'],
                'services_total' => $servicesTotal,
                'total_price' => $totalPrice,
            ]);

            $this->syncReservationServices($reservation, $serviceLines);
        });

        return redirect()
            ->route('tenant.reservations.index')
            ->with('success', 'Reservation mise a jour avec succes.');
    }

    public function destroy(Reservation $reservation): RedirectResponse
    {
        $reservation->delete();

        return redirect()
            ->route('tenant.reservations.index')
            ->with('success', 'Reservation supprimee avec succes.');
    }

    protected function validateReservation(Request $request, ?Reservation $reservation = null, bool $withInitialPayment = false): array
    {
        $reservationMode = $withInitialPayment
            ? (string) $request->input('reservation_mode', 'existing')
            : 'existing';

        $rules = [
            'event_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,confirmed,cancelled'],
            'location_price' => ['required', 'numeric', 'min:0'],
            'service_items' => ['nullable', 'array'],
            'service_items.*.service_id' => [
                'required',
                Rule::exists('services', 'id')->where('tenant_id', tenant('id')),
            ],
            'service_items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ];

        if ($withInitialPayment) {
            $rules['reservation_mode'] = ['nullable', 'in:existing,express'];
            $rules['initial_payment_amount'] = ['nullable', 'numeric', 'min:0'];
            $rules['initial_payment_date'] = ['nullable', 'date'];
            $rules['initial_payment_method'] = ['nullable', 'in:cash,bank_transfer,ccp,cheque'];
        }

        if ($reservationMode === 'express') {
            $rules['client_name'] = ['required', 'string', 'max:255'];
            $rules['client_phone'] = ['required', 'string', 'max:50'];
            $rules['client_email'] = ['nullable', 'email', 'max:255'];
        } else {
            $rules['client_id'] = ['required', 'exists:clients,id'];
        }

        return $request->validate($rules);
    }

    protected function clientOptions()
    {
        return Client::query()
            ->orderBy('name')
            ->get(['id', 'name', 'phone', 'email']);
    }

    protected function statuses(): array
    {
        return [
            ['value' => 'pending', 'label' => 'En attente'],
            ['value' => 'confirmed', 'label' => 'Confirmee'],
            ['value' => 'cancelled', 'label' => 'Annulee'],
        ];
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

    protected function unavailableDates(?Reservation $ignoreReservation = null): array
    {
        return Reservation::query()
            ->where('status', '!=', 'cancelled')
            ->when($ignoreReservation, fn ($query) => $query->where('id', '!=', $ignoreReservation->id))
            ->where('event_date', '>=', now()->toDateString())
            ->orderBy('event_date')
            ->get(['event_date'])
            ->pluck('event_date')
            ->map(fn ($date) => $date->toDateString())
            ->values()
            ->all();
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
        $reservation->reservationServices()->delete();

        foreach ($serviceLines as $serviceLine) {
            $reservation->reservationServices()->create([
                ...$serviceLine,
                'tenant_id' => tenant('id'),
            ]);
        }
    }

    protected function assertDateAvailability(string $eventDate, ?Reservation $ignoreReservation = null, ?string $status = null): void
    {
        if ($status === 'cancelled') {
            return;
        }

        $exists = Reservation::query()
            ->where('status', '!=', 'cancelled')
            ->whereDate('event_date', $eventDate)
            ->when($ignoreReservation, fn ($query) => $query->where('id', '!=', $ignoreReservation->id))
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'event_date' => 'Cette date est deja reservee ou en attente. Choisissez une date libre proche.',
            ]);
        }
    }

    protected function resolveReservationClient(array $data): Client
    {
        if (($data['reservation_mode'] ?? 'existing') !== 'express') {
            return Client::findOrFail($data['client_id']);
        }

        $phone = trim((string) ($data['client_phone'] ?? ''));
        $email = trim((string) ($data['client_email'] ?? ''));

        $client = Client::query()
            ->when($phone !== '' || $email !== '', function ($query) use ($phone, $email) {
                $query->where(function ($innerQuery) use ($phone, $email) {
                    if ($phone !== '') {
                        $innerQuery->where('phone', $phone);
                    }

                    if ($email !== '') {
                        $method = $phone !== '' ? 'orWhere' : 'where';
                        $innerQuery->{$method}('email', $email);
                    }
                });
            })
            ->first();

        if ($client) {
            $client->update([
                'name' => $data['client_name'],
                'phone' => $phone ?: $client->phone,
                'email' => $email ?: $client->email,
            ]);

            return $client;
        }

        return Client::create([
            'name' => $data['client_name'],
            'phone' => $phone ?: null,
            'email' => $email ?: null,
            'notes' => 'Client cree depuis Reservation express.',
        ]);
    }

    protected function tenantPayload(): array
    {
        return [
            'id' => tenant('id'),
            'name' => tenant('name'),
            'plan' => tenant('plan'),
            'domain' => request()->getHost(),
        ];
    }
}
