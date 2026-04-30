<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('location_price', 12, 2)->default(0)->after('status');
            $table->decimal('services_total', 12, 2)->default(0)->after('location_price');
        });

        DB::table('reservations')->update([
            'location_price' => DB::raw('total_price'),
        ]);
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['location_price', 'services_total']);
        });
    }
};
