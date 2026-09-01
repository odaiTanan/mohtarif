<?php

use App\Http\Controllers\Api\ManagementController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssessmentController;
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

Route::middleware(['auth:sanctum'])->prefix('dashboard')->controller(ManagementController::class)->group(function (): void {
    Route::middleware('permission:manage-content')->get('lookups', 'lookups');

    Route::middleware('permission:manage-users')->group(function (): void {
        Route::get('questions', 'questions');
        Route::get('questions/{question}', 'showQuestion');
        Route::post('questions', 'storeQuestion');
        Route::put('questions/{question}', 'updateQuestion');
        Route::delete('questions/{question}', 'destroyQuestion');

        Route::get('assessments/{assessment}', 'showAssessment');
        Route::post('assessments', 'storeAssessment');
        Route::put('assessments/{assessment}', 'updateAssessment');
        Route::delete('assessments/{assessment}', 'destroyAssessment');
    });

    Route::middleware('permission:manage-content')->group(function (): void {
        Route::get('training-plans', 'trainingPlans');
    });

    Route::middleware('permission:take-assessment')->get('assessments', 'assessments');

    Route::middleware('permission:download-certificates')->get('certificates', 'certificates');

    Route::middleware('permission:manage-users')->get('audit-logs', 'auditLogs');
});

Route::middleware('auth:sanctum')->prefix('assessments')->group(function (): void {
    Route::get('{assessment}', [AssessmentController::class, 'show']);
    Route::post('auto-save', [AssessmentController::class, 'autoSave']);
    Route::post('{attempt}/submit', [AssessmentController::class, 'submit']);
    
    Route::middleware('permission:view-reports')->group(function (): void {
        Route::get('{assessment}/attempts', [AssessmentController::class, 'getAttempts']);
        Route::get('attempts/{attempt}', [AssessmentController::class, 'getAttemptDetails']);
    });
});
