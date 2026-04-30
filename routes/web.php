<?php

use App\Http\Controllers\Central\Admin\DashboardController;
use App\Http\Controllers\Central\Admin\OnboardingController;
use App\Http\Controllers\Central\Admin\PlanController;
use App\Http\Controllers\Central\Admin\SupportController;
use App\Http\Controllers\Central\Admin\TenantController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\HallPreviewController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\SallaLandingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

$redirectToPrimaryCentralDomain = function (Request $request, ?string $path = null) {
    $targetHost = parse_url((string) config('app.url'), PHP_URL_HOST)
        ?: (config('tenancy.central_domains')[0] ?? 'localhost');
    $port = $request->getPort();
    $portSegment = in_array($port, [80, 443], true) ? '' : ':'.$port;
    $targetPath = $path ? '/'.ltrim($path, '/') : '/';

    return redirect()->away($request->getScheme().'://'.$targetHost.$portSegment.$targetPath);
};

foreach (['127.0.0.1', 'localhost'] as $legacyCentralDomain) {
    Route::domain($legacyCentralDomain)->group(function () use ($redirectToPrimaryCentralDomain) {
        Route::any('/{path?}', $redirectToPrimaryCentralDomain)->where('path', '.*');
    });
}

foreach (array_filter(config('tenancy.central_domains', []), fn (string $domain) => $domain !== '127.0.0.1') as $domain) {
    Route::domain($domain)->group(function () {
        Route::get('/', SallaLandingController::class)->name('central.home');
        Route::get('/salles', HomeController::class)->name('central.halls.index');
        Route::get('/salles/{tenant:id}', [HallPreviewController::class, 'show'])->name('central.halls.show');
        Route::post('/salles/{tenant:id}/reserver', [HallPreviewController::class, 'store'])->name('central.halls.booking.store');

        Route::middleware(['auth', 'verified'])->group(function () {
            Route::get('/admin', [DashboardController::class, 'index'])->name('central.admin.dashboard');
            Route::get('/admin/clear-cache', function () {
                Artisan::call('route:clear');
                Artisan::call('view:clear');
                return back()->with('success', 'Cache cleared successfully!');
            })->name('central.admin.clear-cache');
            Route::get('/admin/tenants', [TenantController::class, 'index'])->name('central.admin.tenants.index');
            Route::post('/admin/tenants', [TenantController::class, 'store'])->name('central.admin.tenants.store');
            Route::put('/admin/tenants/{tenant}', [TenantController::class, 'update'])->name('central.admin.tenants.update');
            Route::patch('/admin/tenants/{tenant}/status', [TenantController::class, 'toggleStatus'])->name('central.admin.tenants.toggle-status');
            Route::get('/admin/plans', [PlanController::class, 'index'])->name('central.admin.plans.index');
            Route::get('/admin/support', [SupportController::class, 'index'])->name('central.admin.support.index');
            Route::get('/admin/onboarding', [OnboardingController::class, 'index'])->name('central.admin.onboarding.index');

            Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
            Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
            Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        });

        require __DIR__.'/auth.php';
    });
}
