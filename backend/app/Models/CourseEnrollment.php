<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseEnrollment extends Model
{
    public $timestamps = false;

    protected $fillable = ['student_id', 'course_id', 'enrolled_at', 'completion_percentage', 'status', 'certificate_issued_at'];

    protected $casts = ['enrolled_at' => 'datetime', 'certificate_issued_at' => 'datetime'];

    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
    public function student(): BelongsTo { return $this->belongsTo(User::class, 'student_id'); }
}