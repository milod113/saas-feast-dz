<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tenant_id')->nullable()->after('id');
            $table->string('role')->default('owner')->after('name');
            $table->index('tenant_id', 'users_tenant_id_index');
            $table->foreign('tenant_id')
                ->references('id')
                ->on('tenants')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropIndex('users_tenant_id_index');
            $table->unique('email');
            $table->dropColumn(['tenant_id', 'role']);
        });
    }
};
