<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            // Localisation
            $table->string('wilaya')->nullable();
            $table->string('commune')->nullable();
            $table->text('address')->nullable();
            $table->string('gps_latitude')->nullable();
            $table->string('gps_longitude')->nullable();

            // Contact
            $table->string('phone_primary')->nullable();
            $table->string('phone_secondary')->nullable();

            // Caracteristiques de la salle
            $table->integer('capacity_max')->nullable();
            $table->boolean('has_separated_spaces')->default(false);
            $table->integer('parking_capacity')->nullable();

            // Equipements
            $table->boolean('has_generator')->default(false);
            $table->boolean('has_air_conditioning')->default(false);
            $table->boolean('allow_outside_caterer')->default(true);

            // Reseaux sociaux
            $table->string('instagram_url')->nullable();
            $table->string('tiktok_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
