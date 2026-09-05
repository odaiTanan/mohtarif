<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = ['title', 'description', 'category_id', 'instructor_id', 'status', 'level', 'max_students', 'price', 'thumbnail_url', 'thumbnail_public_id', 'course_type'];

    protected $casts = ['price' => 'decimal:2', 'max_students' => 'integer'];

    public function category(): BelongsTo { return $this->belongsTo(CourseCategory::class, 'category_id'); }
    public function instructor(): BelongsTo { return $this->belongsTo(User::class, 'instructor_id'); }
    public function enrollments(): HasMany { return $this->hasMany(CourseEnrollment::class, 'course_id'); }
    public function lessons(): HasMany { return $this->hasMany(CourseLesson::class)->orderBy('sort_order'); }
    public function workshops(): HasMany { return $this->hasMany(CourseWorkshop::class)->orderBy('sort_order'); }
    public function lectures(): HasMany { return $this->hasMany(CourseLecture::class)->orderBy('scheduled_at'); }
}