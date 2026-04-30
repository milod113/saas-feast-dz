<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class Reservation extends Model
{
    use BelongsToTenant;

    protected $appends = [
        'paid_amount',
        'remaining_balance',
        'payment_status',
    ];

    protected $fillable = [
        'tenant_id',
        'client_id',
        'client_name',
        'event_date',
        'status',
        'location_price',
        'services_total',
        'total_price',
        'advance_amount',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'location_price' => 'decimal:2',
            'services_total' => 'decimal:2',
            'total_price' => 'decimal:2',
            'advance_amount' => 'decimal:2',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class)->orderByDesc('payment_date')->orderByDesc('id');
    }

    public function reservationServices(): HasMany
    {
        return $this->hasMany(ReservationService::class);
    }

    public function getPaidAmountAttribute(): float
    {
        if ($this->relationLoaded('payments')) {
            return (float) $this->payments->sum('amount');
        }

        return (float) $this->payments()->sum('amount');
    }

    public function getRemainingBalanceAttribute(): float
    {
        return max((float) $this->total_price - (float) $this->paid_amount, 0);
    }

    public function getPaymentStatusAttribute(): string
    {
        if ((float) $this->paid_amount <= 0) {
            return 'unpaid';
        }

        if ((float) $this->remaining_balance <= 0) {
            return 'paid';
        }

        return 'partial';
    }

    public function syncPaymentSnapshot(): void
    {
        $this->forceFill([
            'advance_amount' => $this->payments()->sum('amount'),
        ])->saveQuietly();
    }
}
