<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $indexes = collect(DB::select('SHOW INDEX FROM users'))->pluck('Key_name');

        Schema::table('users', function (Blueprint $table) use ($indexes) {
            if (! $indexes->contains('users_tenant_id_index')) {
                $table->index('tenant_id', 'users_tenant_id_index');
            }
        });

        if ($indexes->contains('users_tenant_email_unique')) {
            DB::statement('ALTER TABLE users DROP INDEX users_tenant_email_unique');
        }

        if (! $indexes->contains('users_email_unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unique('email');
            });
        }
    }

    public function down(): void
    {
        $indexes = collect(DB::select('SHOW INDEX FROM users'))->pluck('Key_name');

        if ($indexes->contains('users_email_unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique('users_email_unique');
            });
        }

        if (! $indexes->contains('users_tenant_email_unique')) {
            Schema::table('users', function (Blueprint $table) {
                $table->unique(['tenant_id', 'email'], 'users_tenant_email_unique');
            });
        }
    }
};
