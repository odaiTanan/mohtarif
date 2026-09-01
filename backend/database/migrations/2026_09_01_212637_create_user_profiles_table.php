<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade');
            
            $table->string('phone', 20)->nullable();
            $table->string('avatar_url')->nullable();
            $table->longText('bio')->nullable();
            
            // للمدرسين
            $table->string('specialization')->nullable();
            $table->text('qualifications')->nullable();
            $table->integer('experience_years')->nullable();
            
            // العنوان
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('country', 100)->nullable();
            
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
