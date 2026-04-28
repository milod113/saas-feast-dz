<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->orderBy('event_date')
            ->get([
                'id',
                'client_id',
                'client_name',
                'event_date',
                'status',
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
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateReservation($request, null, true);
        $client = Client::findOrFail($data['client_id']);

        $reservation = Reservation::create([
            'client_id' => $client->id,
            'client_name' => $client->name,
            'event_date' => $data['event_date'],
            'status' => $data['status'],
            'total_price' => $data['total_price'],
            'advance_amount' => 0,
        ]);

        if ((float) ($data['initial_payment_amount'] ?? 0) > 0) {
            Payment::create([
                'reservation_id' => $reservation->id,
                'amount' => $data['initial_payment_amount'],
                'payment_date' => $data['initial_payment_date'] ?: $data['event_date'],
                'payment_method' => $data['initial_payment_method'] ?? 'cash',
                'notes' => 'Paiement initial ajoute lors de la creation de la reservation.',
            ]);
        }

        return redirect()
            ->route('tenant.reservations.index')
            ->with('success', 'Reservation creee avec succes.');
    }

    public function edit(Reservation $reservation): Response
    {
        $reservation->load(['client:id,name,phone,email', 'payments:id,reservation_id,amount']);

        return Inertia::render('Tenant/Reservations/Edit', [
            'reservation' => [
                'id' => $reservation->id,
                'client_id' => $reservation->client_id,
                'client_name' => $reservation->client_name,
                'event_date' => optional($reservation->event_date)->format('Y-m-d'),
                'status' => $reservation->status,
                'total_price' => (string) $reservation->total_price,
                'paid_amount' => (string) $reservation->paid_amount,
                'remaining_balance' => (string) $reservation->remaining_balance,
                'payment_status' => $reservation->payment_status,
            ],
            'clients' => $this->clientOptions(),
            'statuses' => $this->statuses(),
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function update(Request $request, Reservation $reservation): RedirectResponse
    {
        $data = $this->validateReservation($request, $reservation, false);
        $client = Client::findOrFail($data['client_id']);

        $reservation->update([
            'client_id' => $client->id,
            'client_name' => $client->name,
            'event_date' => $data['event_date'],
            'status' => $data['status'],
            'total_price' => $data['total_price'],
        ]);

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
        $rules = [
            'client_id' => ['required', 'exists:clients,id'],
            'event_date' => ['required', 'date'],
            'status' => ['required', 'in:pending,confirmed,cancelled'],
            'total_price' => ['required', 'numeric', 'min:0'],
        ];

        if ($withInitialPayment) {
            $rules['initial_payment_amount'] = ['nullable', 'numeric', 'min:0', 'lte:total_price'];
            $rules['initial_payment_date'] = ['nullable', 'date'];
            $rules['initial_payment_method'] = ['nullable', 'in:cash,bank_transfer,ccp,cheque'];
        }

        $data = $request->validate($rules);

        if ($reservation) {
            $reservation->loadMissing('payments:id,reservation_id,amount');

            if ((float) $data['total_price'] + 0.00001 < (float) $reservation->paid_amount) {
                throw ValidationException::withMessages([
                    'total_price' => 'Le montant total ne peut pas etre inferieur aux paiements deja enregistres.',
                ]);
            }
        }

        return $data;
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
