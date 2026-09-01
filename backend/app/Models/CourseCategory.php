<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'icon_url'];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'category_id');
    }
}