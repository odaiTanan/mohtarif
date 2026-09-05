<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseLecture extends Model
{
    protected $fillable = ['course_id', 'title', 'description', 'meeting_url', 'recording_url', 'scheduled_at', 'duration_minutes', 'status'];
    protected $casts = ['scheduled_at' => 'datetime', 'duration_minutes' => 'integer'];
    public function course(): BelongsTo { return $this->belongsTo(Course::class); }
}
