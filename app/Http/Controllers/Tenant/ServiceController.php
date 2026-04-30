<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $services = Service::query()
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get()
            ->map(fn (Service $service) => $this->servicePayload($service));

        return Inertia::render('Tenant/Services/Index', [
            'tenant' => $this->tenantPayload(),
            'services' => $services,
            'pricingTypes' => $this->pricingTypes(),
            'stats' => [
                'total' => $services->count(),
                'active' => $services->where('is_active', true)->count(),
                'averagePrice' => round((float) $services->avg('price'), 2),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Service::create($this->validateService($request));

        return redirect()
            ->route('tenant.services.index')
            ->with('success', 'Service ajoute avec succes.');
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $service->update($this->validateService($request));

        return redirect()
            ->route('tenant.services.index')
            ->with('success', 'Service mis a jour avec succes.');
    }

    public function destroy(Service $service): RedirectResponse
    {
        $service->delete();

        return redirect()
            ->route('tenant.services.index')
            ->with('success', 'Service supprime avec succes.');
    }

    protected function validateService(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'pricing_type' => ['required', 'in:fixed,per_guest,per_hour,quote'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
        ]);
    }

    protected function servicePayload(Service $service): array
    {
        return [
            'id' => $service->id,
            'name' => $service->name,
            'description' => $service->description,
            'pricing_type' => $service->pricing_type,
            'price' => (float) $service->price,
            'is_active' => $service->is_active,
        ];
    }

    protected function pricingTypes(): array
    {
        return [
            ['value' => 'fixed', 'label' => 'Prix fixe'],
            ['value' => 'per_guest', 'label' => 'Par invite'],
            ['value' => 'per_hour', 'label' => 'Par heure'],
            ['value' => 'quote', 'label' => 'Sur devis'],
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
