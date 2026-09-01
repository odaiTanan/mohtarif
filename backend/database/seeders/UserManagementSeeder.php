<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\CourseCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserManagementSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'د. أحمد خالد', 'email' => 'ahmed.teacher@example.com', 'phone' => '0501234567', 'avatar_url' => 'https://i.pravatar.cc/160?img=12', 'bio' => 'مدرس متخصص في تطوير البرمجيات وتقنيات الويب.', 'specialty' => 'تطوير البرمجيات', 'academic_id' => 'T-1001', 'teaching_category_slug' => 'technical', 'role' => 'Teacher'],
            ['name' => 'م. سارة محمد', 'email' => 'sara.teacher@example.com', 'phone' => '0502345678', 'avatar_url' => 'https://i.pravatar.cc/160?img=23', 'bio' => 'مدرسة تصميم وتجربة المستخدم مع خبرة عملية واسعة.', 'specialty' => 'تصميم UX/UI', 'academic_id' => 'T-1002', 'teaching_category_slug' => 'craft', 'role' => 'Teacher'],
            ['name' => 'أ. يوسف علي', 'email' => 'youssef.teacher@example.com', 'phone' => '0503456789', 'avatar_url' => 'https://i.pravatar.cc/160?img=33', 'bio' => 'مدرس قواعد البيانات وتحليل الأنظمة.', 'specialty' => 'قواعد البيانات', 'academic_id' => 'T-1003', 'teaching_category_slug' => 'technical', 'role' => 'Teacher'],
            ['name' => 'د. نورة حسن', 'email' => 'noura.teacher@example.com', 'phone' => '0504567890', 'avatar_url' => 'https://i.pravatar.cc/160?img=47', 'bio' => 'مدرسة الذكاء الاصطناعي وتحليل البيانات.', 'specialty' => 'الذكاء الاصطناعي', 'academic_id' => 'T-1004', 'teaching_category_slug' => 'technical', 'role' => 'Teacher'],
            ['name' => 'م. عمر فهد', 'email' => 'omar.teacher@example.com', 'phone' => '0505678901', 'avatar_url' => 'https://i.pravatar.cc/160?img=51', 'bio' => 'مدرس محترف في الحلاقة والعناية بالشعر.', 'specialty' => 'حلاقة وتصفيف الشعر', 'academic_id' => 'T-1005', 'teaching_category_slug' => 'barber', 'role' => 'Teacher'],
            ['name' => 'ريم عبدالله', 'email' => 'reem.student@example.com', 'phone' => '0551234567', 'avatar_url' => 'https://i.pravatar.cc/160?img=5', 'bio' => 'طالبة مهتمة بتطوير تطبيقات الويب.', 'academic_id' => 'S-2001', 'role' => 'Student'],
            ['name' => 'عبدالرحمن سعد', 'email' => 'abdulrahman.student@example.com', 'phone' => '0552345678', 'avatar_url' => 'https://i.pravatar.cc/160?img=8', 'bio' => 'طالب في مسار البرمجة وتطوير المنتجات الرقمية.', 'academic_id' => 'S-2002', 'role' => 'Student'],
            ['name' => 'ليان ماجد', 'email' => 'layan.student@example.com', 'phone' => '0553456789', 'avatar_url' => 'https://i.pravatar.cc/160?img=9', 'bio' => 'طالبة في مسار التصميم وتجربة المستخدم.', 'academic_id' => 'S-2003', 'role' => 'Student'],
            ['name' => 'خالد إبراهيم', 'email' => 'khaled.student@example.com', 'phone' => '0554567890', 'avatar_url' => 'https://i.pravatar.cc/160?img=11', 'bio' => 'طالب مهتم بتحليل البيانات والذكاء الاصطناعي.', 'academic_id' => 'S-2004', 'role' => 'Student'],
            ['name' => 'جود ناصر', 'email' => 'joud.student@example.com', 'phone' => '0555678901', 'avatar_url' => 'https://i.pravatar.cc/160?img=32', 'bio' => 'طالبة في مسار الأمن السيبراني.', 'academic_id' => 'S-2005', 'role' => 'Student'],
            ['name' => 'مازن طارق', 'email' => 'mazen.student@example.com', 'phone' => '0556789012', 'avatar_url' => 'https://i.pravatar.cc/160?img=14', 'bio' => 'طالب يطور مهاراته في البرمجة العملية.', 'academic_id' => 'S-2006', 'role' => 'Student'],
            ['name' => 'شهد فواز', 'email' => 'shahad.student@example.com', 'phone' => '0557890123', 'avatar_url' => 'https://i.pravatar.cc/160?img=44', 'bio' => 'طالبة مهتمة بالتصميم الرقمي وصناعة المحتوى.', 'academic_id' => 'S-2007', 'role' => 'Student'],
            ['name' => 'أنس وليد', 'email' => 'anas.student@example.com', 'phone' => '0558901234', 'avatar_url' => 'https://i.pravatar.cc/160?img=15', 'bio' => 'طالب في مسار تطوير البرمجيات.', 'academic_id' => 'S-2008', 'role' => 'Student'],
        ];

        foreach ($users as $attributes) {
            $role = $attributes['role'];
            $categorySlug = $attributes['teaching_category_slug'] ?? null;
            unset($attributes['role']);
            unset($attributes['teaching_category_slug']);
            $attributes['teaching_category_id'] = $categorySlug ? CourseCategory::query()->where('slug', $categorySlug)->value('id') : null;

            $user = User::query()->updateOrCreate(
                ['email' => $attributes['email']],
                [...$attributes, 'password' => Hash::make('Password12345!')],
            );

            $user->syncRoles([$role]);
        }
    }
}