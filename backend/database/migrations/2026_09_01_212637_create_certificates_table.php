<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained('course_enrollments')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            
            $table->string('certificate_number', 100)->unique();
            $table->timestamp('issued_at')->useCurrent();
            $table->timestamp('valid_until')->nullable();
            $table->string('certificate_url')->nullable();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            
            $table->index(['student_id', 'issued_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
