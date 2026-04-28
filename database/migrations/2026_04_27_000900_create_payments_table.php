<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('tenant_id');
            $table->foreignId('reservation_id')->constrained()->cascadeOnDelete();
            $table->decimal('amount', 12, 2);
            $table->date('payment_date');
            $table->string('payment_method');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->cascadeOnDelete();
            $table->index(['tenant_id', 'payment_date']);
        });

        $reservations = DB::table('reservations')
            ->where('advance_amount', '>', 0)
            ->get([
                'id',
                'tenant_id',
                'advance_amount',
                'event_date',
                'created_at',
                'updated_at',
            ]);

        foreach ($reservations as $reservation) {
            DB::table('payments')->insert([
                'tenant_id' => $reservation->tenant_id,
                'reservation_id' => $reservation->id,
                'amount' => $reservation->advance_amount,
                'payment_date' => $reservation->event_date,
                'payment_method' => 'cash',
                'notes' => 'Paiement migre depuis advance_amount.',
                'created_at' => $reservation->created_at ?? now(),
                'updated_at' => $reservation->updated_at ?? now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
