<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('notification_type', [
                'new_lesson',
                'schedule_published',
                'attendance_reminder',
                'course_update',
                'certificate_issued',
                'general'
            ])->default('general');
            
            $table->string('title');
            $table->longText('message');
            
            $table->foreignId('related_course_id')->nullable()->constrained('courses')->nullOnDelete();
            $table->foreignId('related_lesson_id')->nullable()->constrained('lessons')->nullOnDelete();
            $table->foreignId('related_schedule_id')->nullable()->constrained('class_schedules')->nullOnDelete();
            
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['user_id', 'is_read']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
