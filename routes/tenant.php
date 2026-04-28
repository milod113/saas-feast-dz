<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\CalendarController;
use App\Http\Controllers\Tenant\ClientController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\PaymentController;
use App\Http\Controllers\Tenant\PublicHallController;
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
    Route::get('/', [PublicHallController::class, 'show'])->name('public.hall.show');
    Route::get('/reserver', [PublicHallController::class, 'show'])->name('public.hall.booking');
    Route::post('/reserver', [PublicHallController::class, 'store'])->name('public.hall.booking.store');

    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('tenant.dashboard');
        Route::get('/calendar', [CalendarController::class, 'index'])->name('tenant.calendar.index');
        Route::get('/reservations', [ReservationController::class, 'index'])->name('tenant.reservations.index');
        Route::get('/reservations/create', [ReservationController::class, 'create'])->name('tenant.reservations.create');
        Route::post('/reservations', [ReservationController::class, 'store'])->name('tenant.reservations.store');
        Route::get('/reservations/{reservation}/edit', [ReservationController::class, 'edit'])->name('tenant.reservations.edit');
        Route::put('/reservations/{reservation}', [ReservationController::class, 'update'])->name('tenant.reservations.update');
        Route::delete('/reservations/{reservation}', [ReservationController::class, 'destroy'])->name('tenant.reservations.destroy');
        Route::get('/payments', [PaymentController::class, 'index'])->name('tenant.payments.index');
        Route::get('/payments/create', [PaymentController::class, 'create'])->name('tenant.payments.create');
        Route::post('/payments', [PaymentController::class, 'store'])->name('tenant.payments.store');
        Route::get('/payments/{payment}/edit', [PaymentController::class, 'edit'])->name('tenant.payments.edit');
        Route::put('/payments/{payment}', [PaymentController::class, 'update'])->name('tenant.payments.update');
        Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])->name('tenant.payments.destroy');

        Route::get('/clients', [ClientController::class, 'index'])->name('tenant.clients.index');
        Route::get('/clients/create', [ClientController::class, 'create'])->name('tenant.clients.create');
        Route::post('/clients', [ClientController::class, 'store'])->name('tenant.clients.store');
        Route::put('/clients/{client}', [ClientController::class, 'update'])->name('tenant.clients.update');
        Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('tenant.clients.destroy');

        Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('tenant.logout');
    });
});
