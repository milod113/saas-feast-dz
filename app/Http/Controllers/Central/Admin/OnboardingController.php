<?php

namespace App\Http\Controllers\Central\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function index(): Response
    {
        $latestTenants = Tenant::query()
            ->with('domains:id,tenant_id,domain')
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn (Tenant $tenant) => [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'domain' => $tenant->domains->first()?->domain,
                'plan' => $tenant->plan,
                'status' => $tenant->status,
                'created_at' => optional($tenant->created_at)->toISOString(),
            ]);

        return Inertia::render('Central/Admin/Onboarding/Index', [
            'checklist' => [
                'Creer le locataire et son sous-domaine',
                'Verifier le plan actif et le statut du compte',
                'Creer ou verifier le proprietaire de la salle',
                'Transmettre les etapes de prise en main',
            ],
            'latestTenants' => $latestTenants,
        ]);
    }
}
