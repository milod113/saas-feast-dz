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
            'wilaya',
            'commune',
            'address',
            'gps_latitude',
            'gps_longitude',
            'phone_primary',
            'phone_secondary',
            'capacity_max',
            'has_separated_spaces',
            'parking_capacity',
            'has_generator',
            'has_air_conditioning',
            'allow_outside_caterer',
            'instagram_url',
            'tiktok_url',
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
        'wilaya',
        'commune',
        'address',
        'gps_latitude',
        'gps_longitude',
        'phone_primary',
        'phone_secondary',
        'capacity_max',
        'has_separated_spaces',
        'parking_capacity',
        'has_generator',
        'has_air_conditioning',
        'allow_outside_caterer',
        'instagram_url',
        'tiktok_url',
        'data',
    ];

    protected $casts = [
        'capacity_max' => 'integer',
        'has_separated_spaces' => 'boolean',
        'parking_capacity' => 'integer',
        'has_generator' => 'boolean',
        'has_air_conditioning' => 'boolean',
        'allow_outside_caterer' => 'boolean',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(TenantPhoto::class)->orderBy('sort_order')->orderBy('id');
    }
}
