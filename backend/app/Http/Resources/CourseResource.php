<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded('category', fn () => ['id' => $this->category->id, 'name' => $this->category->name]),
            'instructor_id' => $this->instructor_id,
            'instructor' => $this->whenLoaded('instructor', fn () => ['id' => $this->instructor->id, 'name' => $this->instructor->name, 'email' => $this->instructor->email, 'avatar_url' => $this->instructor->avatar_url]),
            'status' => $this->status,
            'level' => $this->level,
            'max_students' => $this->max_students,
            'price' => $this->price,
            'thumbnail_url' => $this->thumbnail_url,
            'lessons_count' => $this->when(isset($this->lessons_count), $this->lessons_count),
            'workshops_count' => $this->when(isset($this->workshops_count), $this->workshops_count),
            'lectures_count' => $this->when(isset($this->lectures_count), $this->lectures_count),
            'lessons' => $this->whenLoaded('lessons'),
            'workshops' => $this->whenLoaded('workshops'),
            'lectures' => $this->whenLoaded('lectures'),
            'course_type' => $this->course_type,
            'enrollments_count' => $this->when(isset($this->enrollments_count), $this->enrollments_count),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}