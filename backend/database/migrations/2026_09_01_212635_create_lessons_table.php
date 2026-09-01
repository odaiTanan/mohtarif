<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->longText('description')->nullable();
            $table->enum('lesson_type', ['recorded_video', 'google_meet', 'workshop']);
            $table->integer('lesson_order');
            $table->integer('duration_minutes')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();
            
            $table->unique(['course_id', 'lesson_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
