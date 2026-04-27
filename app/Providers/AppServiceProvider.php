<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $tenantBaseDomain = config('tenancy.tenant_base_domain');

        if ($tenantBaseDomain) {
            config(['session.domain' => env('SESSION_DOMAIN') ?: '.' . ltrim($tenantBaseDomain, '.')]);
        }

        Vite::prefetch(concurrency: 3);
    }
}
