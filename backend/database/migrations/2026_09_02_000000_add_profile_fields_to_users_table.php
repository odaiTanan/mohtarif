<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable()->after('email');
            $table->string('avatar_url')->nullable()->after('phone');
            $table->text('bio')->nullable()->after('avatar_url');
            $table->string('specialty')->nullable()->after('bio');
            $table->string('academic_id', 50)->nullable()->unique()->after('specialty');
            $table->enum('status', ['active', 'inactive'])->default('active')->after('academic_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['academic_id']);
            $table->dropColumn(['phone', 'avatar_url', 'bio', 'specialty', 'academic_id', 'status']);
        });
    }
};