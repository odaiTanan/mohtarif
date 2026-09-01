<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // General permissions for all roles
        $permissions = [
            'view-dashboard',
            'manage-users',
            'manage-content',
            'view-reports',
            'take-assessment',
            'view-own-results',
            'attend-courses',
            'download-certificates',
            'track-own-progress',
        ];

        foreach ($permissions as $permissionName) {
            Permission::query()->firstOrCreate([
                'name' => $permissionName,
                'guard_name' => 'web',
            ]);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Create general roles: Admin, Teacher, Student
        $adminRole = Role::query()->firstOrCreate([
            'name' => 'Admin',
            'guard_name' => 'web',
        ]);
        $adminRole->syncPermissions($permissions);

        $teacherRole = Role::query()->firstOrCreate([
            'name' => 'Teacher',
            'guard_name' => 'web',
        ]);
        $teacherRole->syncPermissions([
            'view-dashboard',
            'manage-content',
            'view-reports',
            'take-assessment',
            'view-own-results',
        ]);

        $studentRole = Role::query()->firstOrCreate([
            'name' => 'Student',
            'guard_name' => 'web',
        ]);
        $studentRole->syncPermissions([
            'view-dashboard',
            'take-assessment',
            'view-own-results',
            'attend-courses',
            'download-certificates',
            'track-own-progress',
        ]);

        // Create default users for each role
        $admin = User::query()->updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'مدير النظام',
                'password' => Hash::make('Admin12345!'),
            ],
        );
        $admin->syncRoles([$adminRole]);

        $teacher = User::query()->updateOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'مدرس',
                'password' => Hash::make('Teacher12345!'),
            ],
        );
        $teacher->syncRoles([$teacherRole]);

        $student = User::query()->updateOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'طالب',
                'password' => Hash::make('Student12345!'),
            ],
        );
        $student->syncRoles([$studentRole]);
    }
}
