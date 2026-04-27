<?php

use App\Models\Client;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->foreignId('client_id')->nullable()->after('tenant_id')->constrained('clients')->nullOnDelete();
        });

        DB::table('reservations')
            ->orderBy('id')
            ->get()
            ->each(function ($reservation) {
                if (! $reservation->client_name) {
                    return;
                }

                $client = Client::firstOrCreate(
                    [
                        'tenant_id' => $reservation->tenant_id,
                        'name' => $reservation->client_name,
                    ],
                    [
                        'email' => null,
                        'phone' => null,
                        'notes' => null,
                    ]
                );

                DB::table('reservations')
                    ->where('id', $reservation->id)
                    ->update(['client_id' => $client->id]);
            });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
        });
    }
};
