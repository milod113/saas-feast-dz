<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;
use Stancl\Tenancy\Database\Models\Domain;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'baseDomain' => config('tenancy.tenant_base_domain'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): HttpResponse
    {
        $request->validate([
            'hall_name' => 'required|string|max:255',
            'subdomain' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
            ],
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $domain = strtolower($request->string('subdomain')->trim() . '.' . config('tenancy.tenant_base_domain'));

        if (in_array($domain, config('tenancy.central_domains', []), true)) {
            throw ValidationException::withMessages([
                'subdomain' => 'Ce sous-domaine est reserve.',
            ]);
        }

        if (Domain::query()->where('domain', $domain)->exists()) {
            throw ValidationException::withMessages([
                'subdomain' => 'Ce sous-domaine est deja utilise.',
            ]);
        }

        $user = DB::transaction(function () use ($request, $domain) {
            $tenant = Tenant::create([
                'name' => $request->string('hall_name')->trim(),
                'plan' => 'standard',
                'status' => 'active',
            ]);

            $tenant->createDomain([
                'domain' => $domain,
            ]);

            return User::create([
                'tenant_id' => $tenant->id,
                'name' => $request->name,
                'role' => 'owner',
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
        });

        event(new Registered($user));

        Auth::login($user);

        return Inertia::location($this->tenantUrl($request, $domain));
    }

    protected function tenantUrl(Request $request, string $domain): string
    {
        $port = $request->getPort();
        $portSegment = in_array($port, [80, 443], true) ? '' : ':' . $port;

        return $request->getScheme() . '://' . $domain . $portSegment . '/dashboard';
    }
}
