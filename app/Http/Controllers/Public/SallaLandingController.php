<?php

namespace App\Http\Controllers\Public;

use Inertia\Response;

class SallaLandingController
{
    public function __invoke(): Response
    {
        return inertia('SallaLanding');
    }
}