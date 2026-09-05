<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_categories', function (Blueprint $table): void {
            $table->string('image_url')->nullable()->after('description');
            $table->string('image_public_id')->nullable()->after('image_url');
        });

        Schema::table('courses', function (Blueprint $table): void {
            $table->string('thumbnail_public_id')->nullable()->after('thumbnail_url');
        });

        Schema::create('course_lessons', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('video_url')->nullable();
            $table->string('video_public_id')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });

        Schema::create('course_workshops', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('image_public_id')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('course_lectures', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('meeting_url')->nullable();
            $table->string('recording_url')->nullable();
            $table->dateTime('scheduled_at')->nullable();
            $table->unsignedInteger('duration_minutes')->nullable();
            $table->enum('status', ['scheduled', 'live', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_lectures');
        Schema::dropIfExists('course_workshops');
        Schema::dropIfExists('course_lessons');
        Schema::table('courses', function (Blueprint $table): void { $table->dropColumn('thumbnail_public_id'); });
        Schema::table('course_categories', function (Blueprint $table): void { $table->dropColumn(['image_url', 'image_public_id']); });
    }
};
