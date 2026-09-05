<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLesson extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'video_url', 'video_public_id', 'sort_order', 'is_published'];
    protected $casts = ['is_published' => 'boolean', 'sort_order' => 'integer'];
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
