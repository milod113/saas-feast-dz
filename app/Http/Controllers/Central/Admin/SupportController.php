<?php

namespace App\Http\Controllers\Central\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Inertia\Inertia;
use Inertia\Response;

class SupportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Central/Admin/Support/Index', [
            'metrics' => [
                'activeTenants' => Tenant::where('status', 'active')->count(),
                'suspendedTenants' => Tenant::where('status', 'suspended')->count(),
                'newTenants' => Tenant::where('created_at', '>=', now()->subDays(7))->count(),
            ],
            'resources' => [
                [
                    'title' => 'Guide de demarrage',
                    'description' => 'Checklist interne pour lancer une nouvelle salle sur la plateforme.',
                ],
                [
                    'title' => 'Support abonnements',
                    'description' => 'Procedures pour changement de plan, suspension et reactivation.',
                ],
                [
                    'title' => 'Support exploitation',
                    'description' => 'Verifications de base pour reservations, paiements et acces utilisateur.',
                ],
            ],
        ]);
    }
}
