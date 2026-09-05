<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseWorkshop extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'image_url', 'image_public_id', 'scheduled_at', 'duration_minutes', 'sort_order'];
    protected $casts = ['scheduled_at' => 'datetime', 'duration_minutes' => 'integer', 'sort_order' => 'integer'];
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
