<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class PackController extends Controller
{
    public function index(): Response
    {
        $packs = Pack::query()
            ->with('packServices.service')
            ->orderByDesc('is_active')
            ->orderBy('name')
            ->get()
            ->map(fn (Pack $pack) => $this->packPayload($pack));

        return Inertia::render('Tenant/Packs/Index', [
            'tenant' => $this->tenantPayload(),
            'packs' => $packs,
            'services' => $this->serviceOptions(),
            'stats' => [
                'total' => $packs->count(),
                'active' => $packs->where('is_active', true)->count(),
                'averagePrice' => round((float) $packs->avg('price'), 2),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatePack($request);
        $serviceItems = $data['service_items'] ?? [];
        unset($data['service_items']);

        DB::transaction(function () use ($data, $serviceItems): void {
            $pack = Pack::create($data);

            $this->syncPackServices($pack, $serviceItems);
        });

        return redirect()
            ->route('tenant.packs.index')
            ->with('success', 'Pack ajoute avec succes.');
    }

    public function update(Request $request, Pack $pack): RedirectResponse
    {
        $data = $this->validatePack($request);
        $serviceItems = $data['service_items'] ?? [];
        unset($data['service_items']);

        DB::transaction(function () use ($pack, $data, $serviceItems): void {
            $pack->update($data);

            $this->syncPackServices($pack, $serviceItems);
        });

        return redirect()
            ->route('tenant.packs.index')
            ->with('success', 'Pack mis a jour avec succes.');
    }

    public function destroy(Pack $pack): RedirectResponse
    {
        $pack->delete();

        return redirect()
            ->route('tenant.packs.index')
            ->with('success', 'Pack supprime avec succes.');
    }

    protected function validatePack(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0'],
            'is_active' => ['boolean'],
            'service_items' => ['nullable', 'array'],
            'service_items.*.service_id' => [
                'required',
                Rule::exists('services', 'id')->where('tenant_id', tenant('id')),
            ],
            'service_items.*.quantity' => ['required', 'integer', 'min:1', 'max:999'],
        ]);
    }

    protected function syncPackServices(Pack $pack, array $serviceItems): void
    {
        $pack->packServices()->delete();

        $normalized = collect($serviceItems)
            ->map(fn ($item) => [
                'service_id' => (int) ($item['service_id'] ?? 0),
                'quantity' => max(1, (int) ($item['quantity'] ?? 1)),
            ])
            ->filter(fn ($item) => $item['service_id'] > 0)
            ->keyBy('service_id')
            ->values();

        foreach ($normalized as $item) {
            $pack->packServices()->create([
                'tenant_id' => tenant('id'),
                'service_id' => $item['service_id'],
                'quantity' => $item['quantity'],
            ]);
        }
    }

    protected function packPayload(Pack $pack): array
    {
        return [
            'id' => $pack->id,
            'name' => $pack->name,
            'description' => $pack->description,
            'price' => (float) $pack->price,
            'is_active' => $pack->is_active,
            'services' => $pack->packServices
                ->map(fn ($line) => [
                    'id' => $line->id,
                    'service_id' => $line->service_id,
                    'service_name' => $line->service?->name,
                    'pricing_type' => $line->service?->pricing_type,
                    'unit_price' => (float) ($line->service?->price ?? 0),
                    'quantity' => $line->quantity,
                    'subtotal' => $line->service?->pricing_type === 'quote'
                        ? 0
                        : (float) ($line->service?->price ?? 0) * $line->quantity,
                ])
                ->values(),
        ];
    }

    protected function serviceOptions()
    {
        return Service::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'description', 'pricing_type', 'price'])
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'pricing_type' => $service->pricing_type,
                'price' => (float) $service->price,
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
