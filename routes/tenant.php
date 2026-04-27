<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\CalendarController;
use App\Http\Controllers\Tenant\ClientController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\ReservationController;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    Route::get('/', function () {
        return redirect()->route('tenant.dashboard');
    });

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
        Route::get('/calendar', [CalendarController::class, 'index'])->name('tenant.calendar.index');
        Route::get('/reservations', [ReservationController::class, 'index'])->name('tenant.reservations.index');
        Route::get('/reservations/create', [ReservationController::class, 'create'])->name('tenant.reservations.create');
        Route::post('/reservations', [ReservationController::class, 'store'])->name('tenant.reservations.store');
        Route::get('/reservations/{reservation}/edit', [ReservationController::class, 'edit'])->name('tenant.reservations.edit');
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update'])->name('tenant.reservations.update');
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('tenant.reservations.destroy');

        Route::get('/clients', [ClientController::class, 'index'])->name('tenant.clients.index');
        Route::post('/clients', [ClientController::class, 'store'])->name('tenant.clients.store');
        Route::put('/clients/{client}', [ClientController::class, 'update'])->name('tenant.clients.update');
        Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('tenant.clients.destroy');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('tenant.logout');
    });
});
