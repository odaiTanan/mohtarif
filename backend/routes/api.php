<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\CoursesController;
use App\Http\Controllers\Api\CourseCategoriesController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::middleware('auth:sanctum')->get('me', [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'permission:view-dashboard'])->get('dashboard', function () {
    return response()->json([
        'message' => 'تم تحميل بيانات لوحة التحكم بنجاح.',
    ]);
});

Route::middleware(['auth:sanctum', 'permission:manage-users'])->prefix('users')->controller(UsersController::class)->group(function (): void {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('{user}', 'show');
    Route::put('{user}', 'update');
    Route::delete('{user}', 'destroy');
});

Route::middleware(['auth:sanctum', 'permission:manage-content'])->prefix('dashboard')->controller(CoursesController::class)->group(function (): void {
    Route::get('courses', 'index');
    Route::post('courses', 'store');
    Route::get('courses/{course}', 'show');
    Route::put('courses/{course}', 'update');
    Route::delete('courses/{course}', 'destroy');
    Route::get('course-categories', 'categories');
    Route::get('course-instructors', 'instructors');
});

Route::middleware(['auth:sanctum', 'permission:manage-content'])->prefix('dashboard/course-categories')->controller(CourseCategoriesController::class)->group(function (): void {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::put('/{courseCategory}', 'update');
    Route::delete('/{courseCategory}', 'destroy');
});
