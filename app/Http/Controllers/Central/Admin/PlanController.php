<?php

namespace App\Http\Controllers\Central\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Central/Admin/Plans/Index', [
            'plans' => [
                [
                    'name' => 'Standard',
                    'price' => '4 900 DZD',
                    'description' => 'Pour les salles qui veulent structurer leurs reservations et paiements.',
                    'features' => [
                        'Calendrier intelligent',
                        'Gestion des reservations',
                        'Suivi des paiements',
                    ],
                ],
                [
                    'name' => 'Pro',
                    'price' => '8 900 DZD',
                    'description' => 'Pour les etablissements qui veulent une gestion commerciale complete.',
                    'features' => [
                        'Contrats automatises',
                        'Reporting avance',
                        'Support prioritaire',
                    ],
                ],
            ],
        ]);
    }
}
