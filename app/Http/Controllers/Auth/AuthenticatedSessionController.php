<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): HttpResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        if ($user?->isTenantUser() && $user->tenant?->domains()->exists()) {
            $tenantDomain = $user->tenant->domains()->first()->domain;
            $port = $request->getPort();
            $portSegment = in_array($port, [80, 443], true) ? '' : ':' . $port;

            return Inertia::location($request->getScheme() . '://' . $tenantDomain . $portSegment . '/dashboard');
        }

        return redirect()->route('central.admin.dashboard');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): HttpResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if (function_exists('tenant') && tenant()) {
            $centralDomain = parse_url((string) config('app.url'), PHP_URL_HOST)
                ?: (config('tenancy.central_domains')[0] ?? 'localhost');
            $port = $request->getPort();
            $portSegment = in_array($port, [80, 443], true) ? '' : ':' . $port;

            return Inertia::location($request->getScheme() . '://' . $centralDomain . $portSegment . '/');
        }

        return redirect('/');
    }
}
