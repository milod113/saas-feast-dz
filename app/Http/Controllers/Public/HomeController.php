<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $halls = Tenant::query()
            ->with(['domains:id,tenant_id,domain', 'photos:id,tenant_id,path,sort_order'])
            ->where('status', 'active')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($hallQuery) use ($search) {
                    $hallQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhereHas('domains', fn ($domainQuery) => $domainQuery->where('domain', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->get()
            ->map(fn (Tenant $tenant) => $this->hallPayload($tenant, $request))
            ->values();

        return Inertia::render('Public/Home', [
            'filters' => [
                'search' => $search,
            ],
            'halls' => $halls,
            'plans' => $this->plansPayload(),
            'stats' => [
                'activeHalls' => Tenant::where('status', 'active')->count(),
                'availablePlans' => Tenant::query()
                    ->where('status', 'active')
                    ->distinct('plan')
                    ->count('plan'),
                'tenantBaseDomain' => config('tenancy.tenant_base_domain'),
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    protected function hallPayload(Tenant $tenant, Request $request): array
    {
        $domain = $tenant->domains->first()?->domain;

        return [
            'id' => $tenant->id,
            'name' => $tenant->name,
            'plan' => $tenant->plan,
            'domain' => $domain,
            'wilaya' => $tenant->wilaya,
            'commune' => $tenant->commune,
            'address' => $tenant->address,
            'capacity_max' => $tenant->capacity_max,
            'parking_capacity' => $tenant->parking_capacity,
            'has_air_conditioning' => (bool) $tenant->has_air_conditioning,
            'cover_photo_url' => $tenant->photos->first()?->path
                ? Storage::disk('public')->url($tenant->photos->first()->path)
                : null,
            'url' => route('central.halls.show', $tenant->id),
            'booking_url' => route('central.halls.show', $tenant->id).'#reservation',
        ];
    }

    protected function plansPayload(): array
    {
        $catalog = [
            'standard' => [
                'name' => 'Standard',
                'price' => '4 900 DZD',
                'description' => 'Pour les salles qui veulent structurer leurs reservations et paiements.',
                'features' => [
                    'Calendrier intelligent',
                    'Gestion des reservations',
                    'Suivi des paiements',
                ],
                'buttonText' => 'Commencer',
                'buttonVariant' => 'outline',
                'popular' => false,
            ],
            'pro' => [
                'name' => 'Pro',
                'price' => '8 900 DZD',
                'description' => 'Pour les etablissements qui veulent une gestion commerciale complete.',
                'features' => [
                    'Contrats automatises',
                    'Reporting avance',
                    'Support prioritaire',
                ],
                'buttonText' => 'Essai gratuit 14 jours',
                'buttonVariant' => 'gradient',
                'popular' => true,
            ],
        ];

        $usage = Tenant::query()
            ->select('plan')
            ->selectRaw('COUNT(*) as tenants_count')
            ->where('status', 'active')
            ->whereNotNull('plan')
            ->groupBy('plan')
            ->orderByDesc('tenants_count')
            ->get()
            ->keyBy(fn ($tenant) => strtolower((string) $tenant->plan));

        $knownPlans = collect($catalog)
            ->map(function (array $plan, string $key) use ($usage) {
                $record = $usage->get($key);

                return array_merge($plan, [
                    'slug' => $key,
                    'tenantCount' => (int) ($record->tenants_count ?? 0),
                ]);
            });

        $extraPlans = $usage
            ->reject(fn ($record, string $key) => array_key_exists($key, $catalog))
            ->map(function ($record, string $key) {
                return [
                    'slug' => $key,
                    'name' => ucfirst($key),
                    'price' => 'Sur devis',
                    'description' => 'Plan detecte dans votre base actuelle.',
                    'features' => [
                        'Configuration personnalisee',
                        'Activation par l equipe',
                    ],
                    'buttonText' => 'Nous contacter',
                    'buttonVariant' => 'outline',
                    'popular' => false,
                    'tenantCount' => (int) $record->tenants_count,
                ];
            });

        return $knownPlans
            ->concat($extraPlans)
            ->sortByDesc('tenantCount')
            ->values()
            ->all();
    }
}
