<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase;
    use HasDomains;

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'name',
            'plan',
            'status',
            'data',
            'created_at',
            'updated_at',
        ];
    }

    protected $fillable = [
        'id',
        'name',
        'plan',
        'status',
        'data',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
