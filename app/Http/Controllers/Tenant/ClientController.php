<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        $clients = Client::query()
            ->withCount('reservations')
            ->latest()
            ->get([
                'id',
                'name',
                'email',
                'phone',
                'notes',
                'created_at',
            ]);

        return Inertia::render('Tenant/Clients/Index', [
            'clients' => $clients,
            'tenant' => $this->tenantPayload(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validateClient($request);

        Client::create($data);

        return redirect()
            ->route('tenant.clients.index')
            ->with('success', 'Client cree avec succes.');
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $data = $this->validateClient($request);

        $client->update($data);

        return redirect()
            ->route('tenant.clients.index')
            ->with('success', 'Client mis a jour avec succes.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        $client->delete();

        return redirect()
            ->route('tenant.clients.index')
            ->with('success', 'Client supprime avec succes.');
    }

    protected function validateClient(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'notes' => ['nullable', 'string', 'max:2000'],
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
