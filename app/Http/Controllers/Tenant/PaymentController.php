<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function index(Request $request): Response
    {
        $status = (string) $request->string('status');
        $method = (string) $request->string('method');
        $reservationId = $request->integer('reservation_id');

        $payments = Payment::query()
            ->with([
                'reservation:id,client_name,event_date,total_price,advance_amount',
                'reservation.payments:id,reservation_id,amount',
            ])
            ->when($method !== '', fn ($query) => $query->where('payment_method', $method))
            ->when($reservationId > 0, fn ($query) => $query->where('reservation_id', $reservationId))
            ->orderByDesc('payment_date')
            ->orderByDesc('id')
            ->get()
            ->filter(function (Payment $payment) use ($status): bool {
                if ($status === '') {
                    return true;
                }

                return $payment->reservation?->payment_status === $status;
            })
            ->values()
            ->map(fn (Payment $payment) => [
                'id' => $payment->id,
                'amount' => (float) $payment->amount,
                'payment_date' => optional($payment->payment_date)->format('Y-m-d'),
                'payment_method' => $payment->payment_method,
                'notes' => $payment->notes,
                'reservation' => $payment->reservation ? [
                    'id' => $payment->reservation->id,
                    'client_name' => $payment->reservation->client_name,
                    'event_date' => optional($payment->reservation->event_date)->format('Y-m-d'),
                    'total_price' => (float) $payment->reservation->total_price,
                    'paid_amount' => (float) $payment->reservation->paid_amount,
                    'remaining_balance' => (float) $payment->reservation->remaining_balance,
                    'payment_status' => $payment->reservation->payment_status,
                ] : null,
            ]);

        return Inertia::render('Tenant/Payments/Index', [
            'tenant' => $this->tenantPayload(),
            'filters' => [
                'status' => $status,
                'method' => $method,
                'reservation_id' => $reservationId > 0 ? (string) $reservationId : '',
            ],
            'payments' => $payments,
            'reservations' => $this->reservationOptions(),
            'paymentMethods' => $this->paymentMethods(),
            'paymentStatuses' => $this->paymentStatuses(),
            'stats' => [
                'totalCollected' => (float) Payment::sum('amount'),
                'unpaidReservations' => Reservation::with('payments:id,reservation_id,amount')->get()->where('payment_status', 'unpaid')->count(),
                'partialReservations' => Reservation::with('payments:id,reservation_id,amount')->get()->where('payment_status', 'partial')->count(),
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('Tenant/Payments/Create', [
            'tenant' => $this->tenantPayload(),
            'reservations' => $this->reservationOptions(),
            'paymentMethods' => $this->paymentMethods(),
            'filters' => [
                'status' => (string) $request->string('status'),
                'method' => (string) $request->string('method'),
                'reservation_id' => (string) $request->string('reservation_id'),
            ],
        ]);
    }

    public function edit(Request $request, Payment $payment): Response
    {
        return Inertia::render('Tenant/Payments/Edit', [
            'tenant' => $this->tenantPayload(),
            'payment' => [
                'id' => $payment->id,
                'reservation_id' => $payment->reservation_id,
                'amount' => (float) $payment->amount,
                'payment_date' => optional($payment->payment_date)->format('Y-m-d'),
                'payment_method' => $payment->payment_method,
                'notes' => $payment->notes,
            ],
            'reservations' => $this->reservationOptions(),
            'paymentMethods' => $this->paymentMethods(),
            'filters' => [
                'status' => (string) $request->string('status'),
                'method' => (string) $request->string('method'),
                'reservation_id' => (string) $request->string('reservation_id'),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePayment($request);
        $reservation = Reservation::with('payments')->findOrFail($data['reservation_id']);

        Payment::create([
            'reservation_id' => $reservation->id,
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()
            ->route('tenant.payments.index', $this->redirectFilters($request))
            ->with('success', 'Paiement enregistre avec succes.');
    }

    public function update(Request $request, Payment $payment): RedirectResponse
    {
        $data = $this->validatePayment($request, $payment);
        $reservation = Reservation::with('payments')->findOrFail($data['reservation_id']);

        $payment->update([
            'reservation_id' => $reservation->id,
            'amount' => $data['amount'],
            'payment_date' => $data['payment_date'],
            'payment_method' => $data['payment_method'],
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()
            ->route('tenant.payments.index', $this->redirectFilters($request))
            ->with('success', 'Paiement mis a jour avec succes.');
    }

    public function destroy(Request $request, Payment $payment): RedirectResponse
    {
        $payment->delete();

        return redirect()
            ->route('tenant.payments.index', $this->redirectFilters($request))
            ->with('success', 'Paiement supprime avec succes.');
    }

    protected function validatePayment(Request $request, ?Payment $payment = null): array
    {
        $data = $request->validate([
            'reservation_id' => ['required', 'exists:reservations,id'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'payment_date' => ['required', 'date'],
            'payment_method' => ['required', 'in:cash,bank_transfer,ccp,cheque'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $reservation = Reservation::with('payments')->findOrFail($data['reservation_id']);
        $alreadyPaid = (float) $reservation->paid_amount - (float) ($payment?->amount ?? 0);
        $nextPaid = $alreadyPaid + (float) $data['amount'];

        if ($nextPaid - (float) $reservation->total_price > 0.00001) {
            throw ValidationException::withMessages([
                'amount' => 'Le total des paiements ne peut pas depasser le montant total de la reservation.',
            ]);
        }

        return $data;
    }

    protected function reservationOptions()
    {
        return Reservation::query()
            ->with('payments:id,reservation_id,amount')
            ->orderByDesc('event_date')
            ->get(['id', 'client_name', 'event_date', 'total_price', 'advance_amount'])
            ->map(fn (Reservation $reservation) => [
                'id' => $reservation->id,
                'label' => sprintf(
                    '%s - %s',
                    $reservation->client_name,
                    optional($reservation->event_date)->format('d/m/Y')
                ),
                'total_price' => (float) $reservation->total_price,
                'paid_amount' => (float) $reservation->paid_amount,
                'remaining_balance' => (float) $reservation->remaining_balance,
                'payment_status' => $reservation->payment_status,
            ]);
    }

    protected function paymentMethods(): array
    {
        return [
            ['value' => 'cash', 'label' => 'Especes'],
            ['value' => 'bank_transfer', 'label' => 'Virement bancaire'],
            ['value' => 'ccp', 'label' => 'CCP'],
            ['value' => 'cheque', 'label' => 'Cheque'],
        ];
    }

    protected function paymentStatuses(): array
    {
        return [
            ['value' => 'unpaid', 'label' => 'Non paye'],
            ['value' => 'partial', 'label' => 'Partiel'],
            ['value' => 'paid', 'label' => 'Paye'],
        ];
    }

    protected function redirectFilters(Request $request): array
    {
        return array_filter([
            'status' => $request->input('status'),
            'method' => $request->input('method'),
            'reservation_id' => $request->input('reservation_id_filter'),
        ], fn ($value) => $value !== null && $value !== '');
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
