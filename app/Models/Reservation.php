<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Reservation extends Model
{
    use BelongsToTenant;

    protected $appends = [
        'remaining_balance',
    ];

    protected $fillable = [
        'tenant_id',
        'client_id',
        'client_name',
        'event_date',
        'status',
        'total_price',
        'advance_amount',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'total_price' => 'decimal:2',
            'advance_amount' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function getRemainingBalanceAttribute(): float
    {
        return max((float) $this->total_price - (float) $this->advance_amount, 0);
    }
}
