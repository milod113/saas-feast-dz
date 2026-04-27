<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $totalReservations = Reservation::count();

        $totalRevenue = Reservation::query()
            ->where('status', 'confirmed')
            ->sum('total_price');

        $recentReservations = Reservation::query()
            ->latest()
            ->limit(5)
            ->get([
                'id',
                'client_name',
                'event_date',
                'status',
                'total_price',
                'created_at',
            ]);

        return Inertia::render('Tenant/Dashboard', [
            'tenant' => [
                'id' => tenant('id'),
                'name' => tenant('name'),
                'plan' => tenant('plan'),
                'domain' => request()->getHost(),
            ],
            'stats' => [
                'totalReservations' => $totalReservations,
                'totalRevenue' => (float) $totalRevenue,
            ],
            'recentReservations' => $recentReservations,
        ]);
    }
}
