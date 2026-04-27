<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'adminSidebar' => fn () => $this->adminSidebarData($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
        ];
    }

    protected function adminSidebarData(Request $request): ?array
    {
        $isCentralDomain = in_array($request->getHost(), config('tenancy.central_domains', []), true);

        if (! $isCentralDomain || ! $request->user()) {
            return null;
        }

        return [
            'tenants' => Tenant::count(),
            'activeTenants' => Tenant::where('status', 'active')->count(),
            'suspendedTenants' => Tenant::where('status', 'suspended')->count(),
            'plans' => 2,
            'onboarding' => Tenant::where('created_at', '>=', now()->subDays(7))->count(),
        ];
    }
}
