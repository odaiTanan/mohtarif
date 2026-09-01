<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');

            $table->date('scheduled_date');
            $table->time('start_time');
            $table->time('end_time');

            // للورش العملية
            $table->string('location', 500)->nullable();

            // للمحاضرات المباشرة
            $table->string('google_meet_link', 500)->nullable();

            $table->integer('max_capacity')->nullable();
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();

            $table->index('scheduled_date');
            $table->index(['course_id', 'scheduled_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_schedules');
    }
};