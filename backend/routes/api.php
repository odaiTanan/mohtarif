<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UsersController;
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
