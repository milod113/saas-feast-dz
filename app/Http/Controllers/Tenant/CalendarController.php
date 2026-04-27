<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(): Response
    {
        $selectedMonth = request()->string('month')->toString();
        $month = $selectedMonth !== ''
            ? Carbon::createFromFormat('Y-m', $selectedMonth)->startOfMonth()
            : now()->startOfMonth();

        $start = $month->copy()->startOfWeek(Carbon::SATURDAY);
        $end = $month->copy()->endOfMonth()->endOfWeek(Carbon::FRIDAY);

        $reservations = Reservation::query()
            ->with('client:id,name')
            ->whereBetween('event_date', [$start->toDateString(), $end->toDateString()])
            ->orderBy('event_date')
            ->get([
                'id',
                'client_id',
                'client_name',
                'event_date',
                'status',
                'total_price',
                'advance_amount',
            ])
            ->groupBy(fn (Reservation $reservation) => $reservation->event_date->format('Y-m-d'));

        $days = [];
        $cursor = $start->copy();

        while ($cursor->lte($end)) {
            $dateKey = $cursor->format('Y-m-d');

            $days[] = [
                'date' => $dateKey,
                'day' => $cursor->day,
                'inMonth' => $cursor->month === $month->month,
                'isToday' => $cursor->isToday(),
                'reservations' => ($reservations[$dateKey] ?? collect())->map(fn (Reservation $reservation) => [
                    'id' => $reservation->id,
                    'client_name' => $reservation->client_name,
                    'status' => $reservation->status,
                    'total_price' => (float) $reservation->total_price,
                    'advance_amount' => (float) $reservation->advance_amount,
                    'remaining_balance' => (float) $reservation->remaining_balance,
                ])->values(),
            ];

            $cursor->addDay();
        }

        return Inertia::render('Tenant/Calendar/Index', [
            'tenant' => $this->tenantPayload(),
            'month' => [
                'label' => $month->locale('fr')->translatedFormat('F Y'),
                'value' => $month->format('Y-m'),
                'previous' => $month->copy()->subMonth()->format('Y-m'),
                'next' => $month->copy()->addMonth()->format('Y-m'),
            ],
            'days' => $days,
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
