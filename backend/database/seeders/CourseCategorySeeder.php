<?php

namespace Database\Seeders;

use App\Models\CourseCategory;
use Illuminate\Database\Seeder;

class CourseCategorySeeder extends Seeder
{
    public function run(): void
    {
        foreach ([['name' => 'تقني', 'slug' => 'technical'], ['name' => 'حرف', 'slug' => 'craft'], ['name' => 'حلاقة', 'slug' => 'barber']] as $category) {
            CourseCategory::query()->updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}