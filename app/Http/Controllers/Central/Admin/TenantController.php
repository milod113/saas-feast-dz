<?php

namespace App\Http\Controllers\Central\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Models\Domain;

class TenantController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $tenants = Tenant::query()
            ->with(['domains:id,tenant_id,domain', 'users:id,tenant_id,name,email'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($tenantQuery) use ($search) {
                    $tenantQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhereHas('domains', fn ($domainQuery) => $domainQuery->where('domain', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->get()
            ->map(function (Tenant $tenant) {
                $primaryDomain = $tenant->domains->first();
                $owner = $tenant->users->first();

                return [
                    'id' => $tenant->id,
                    'name' => $tenant->name,
                    'plan' => $tenant->plan,
                    'status' => $tenant->status,
                    'domain' => $primaryDomain?->domain,
                    'owner' => $owner ? [
                        'name' => $owner->name,
                        'email' => $owner->email,
                    ] : null,
                    'created_at' => optional($tenant->created_at)->toISOString(),
                ];
            });

        return Inertia::render('Central/Admin/Tenants/Index', [
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                'totalTenants' => Tenant::count(),
                'activeTenants' => Tenant::where('status', 'active')->count(),
                'suspendedTenants' => Tenant::where('status', 'suspended')->count(),
            ],
            'plans' => [
                ['value' => 'standard', 'label' => 'Standard'],
                ['value' => 'pro', 'label' => 'Pro'],
            ],
            'statuses' => [
                ['value' => 'active', 'label' => 'Actif'],
                ['value' => 'suspended', 'label' => 'Suspendu'],
            ],
            'baseDomain' => config('tenancy.tenant_base_domain'),
            'tenants' => $tenants,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateTenant($request);
        $domain = $this->normalizeDomain($data['subdomain']);

        $tenant = Tenant::create([
            'name' => $data['name'],
            'plan' => $data['plan'],
            'status' => $data['status'],
        ]);

        $tenant->createDomain([
            'domain' => $domain,
        ]);

        return redirect()
            ->route('central.admin.tenants.index')
            ->with('success', 'Locataire cree avec succes.');
    }

    public function update(Request $request, Tenant $tenant): RedirectResponse
    {
        $data = $this->validateTenant($request, $tenant);
        $domain = $this->normalizeDomain($data['subdomain']);

        $tenant->update([
            'name' => $data['name'],
            'plan' => $data['plan'],
            'status' => $data['status'],
        ]);

        $existingDomain = $tenant->domains()->first();

        if ($existingDomain) {
            $existingDomain->update(['domain' => $domain]);
        } else {
            $tenant->createDomain(['domain' => $domain]);
        }

        return redirect()
            ->route('central.admin.tenants.index')
            ->with('success', 'Locataire mis a jour avec succes.');
    }

    public function toggleStatus(Tenant $tenant): RedirectResponse
    {
        $tenant->update([
            'status' => $tenant->status === 'active' ? 'suspended' : 'active',
        ]);

        return redirect()
            ->route('central.admin.tenants.index')
            ->with('success', 'Statut du locataire mis a jour.');
    }

    protected function validateTenant(Request $request, ?Tenant $tenant = null): array
    {
        $domainId = $tenant?->domains()->first()?->id;

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'subdomain' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                function (string $attribute, mixed $value, \Closure $fail) use ($domainId) {
                    $domain = $this->normalizeDomain((string) $value);

                    if (in_array($domain, config('tenancy.central_domains', []), true)) {
                        $fail('Ce sous-domaine est reserve.');
                    }

                    $exists = Domain::query()
                        ->where('domain', $domain)
                        ->when($domainId, fn ($query) => $query->where('id', '!=', $domainId))
                        ->exists();

                    if ($exists) {
                        $fail('Ce sous-domaine est deja utilise.');
                    }
                },
            ],
            'plan' => ['required', 'in:standard,pro'],
            'status' => ['required', 'in:active,suspended'],
        ]);
    }

    protected function normalizeDomain(string $subdomain): string
    {
        return strtolower(trim($subdomain) . '.' . config('tenancy.tenant_base_domain'));
    }
}
