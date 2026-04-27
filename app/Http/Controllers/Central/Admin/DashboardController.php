<?php

namespace App\Http\Controllers\Central\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'totalTenants' => Tenant::count(),
            'activeTenants' => Tenant::where('status', 'active')->count(),
            'suspendedTenants' => Tenant::where('status', 'suspended')->count(),
            'newThisMonth' => Tenant::where('created_at', '>=', now()->startOfMonth())->count(),
        ];

        $recentTenants = Tenant::query()
            ->with('domains:id,tenant_id,domain')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'plan' => $tenant->plan,
                'status' => $tenant->status,
                'domain' => $tenant->domains->first()?->domain,
                'created_at' => optional($tenant->created_at)->toISOString(),
            ]);

        return Inertia::render('Central/Admin/Dashboard', [
            'stats' => $stats,
            'recentTenants' => $recentTenants,
        ]);
    }
}
