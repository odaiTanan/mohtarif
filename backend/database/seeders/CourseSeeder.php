<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $technical = CourseCategory::query()->where('slug', 'technical')->firstOrFail();
        $craft = CourseCategory::query()->where('slug', 'craft')->firstOrFail();
        $barber = CourseCategory::query()->where('slug', 'barber')->firstOrFail();
        $technicalTeacher = User::query()->where('email', 'ahmed.teacher@example.com')->firstOrFail();
        $craftTeacher = User::query()->where('email', 'sara.teacher@example.com')->firstOrFail();
        $barberTeacher = User::query()->where('email', 'omar.teacher@example.com')->firstOrFail();

        $courses = [
            ['title' => 'أساسيات تطوير الويب', 'category_id' => $technical->id, 'instructor_id' => $technicalTeacher->id, 'course_type' => 'technical', 'level' => 'beginner', 'price' => 450, 'max_students' => 30, 'status' => 'published', 'thumbnail_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640'],
            ['title' => 'تحليل البيانات بلغة Python', 'category_id' => $technical->id, 'instructor_id' => $technicalTeacher->id, 'course_type' => 'technical', 'level' => 'intermediate', 'price' => 600, 'max_students' => 25, 'status' => 'draft', 'thumbnail_url' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640'],
            ['title' => 'التصميم الرقمي للمبتدئين', 'category_id' => $craft->id, 'instructor_id' => $craftTeacher->id, 'course_type' => 'craft', 'level' => 'beginner', 'price' => 300, 'max_students' => 20, 'status' => 'published', 'thumbnail_url' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=640'],
            ['title' => 'حلاقة الرجال وتصفيف الشعر', 'category_id' => $barber->id, 'instructor_id' => $barberTeacher->id, 'course_type' => 'craft', 'level' => 'beginner', 'price' => 500, 'max_students' => 15, 'status' => 'published', 'thumbnail_url' => 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=640'],
            ['title' => 'إدارة المشاريع التقنية', 'category_id' => $technical->id, 'instructor_id' => $technicalTeacher->id, 'course_type' => 'technical', 'level' => 'advanced', 'price' => 750, 'max_students' => 18, 'status' => 'archived', 'thumbnail_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=640'],
        ];

        foreach ($courses as $course) {
            Course::query()->updateOrCreate(['title' => $course['title']], $course);
        }
    }
}