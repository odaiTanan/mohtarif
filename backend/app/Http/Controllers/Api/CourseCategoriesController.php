<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CourseCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Services\CloudinaryService;

class CourseCategoriesController extends Controller
{
    public function __construct(private readonly CloudinaryService $cloudinary) {}

    public function index(): JsonResponse
    {
        return response()->json(['data' => CourseCategory::query()->withCount('courses')->orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100', 'unique:course_categories,name'], 'description' => ['nullable', 'string']]);
        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(5);
        return response()->json(['data' => CourseCategory::query()->create($data), 'message' => 'تمت إضافة التصنيف.'], 201);
    }

    public function update(Request $request, CourseCategory $courseCategory): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100', 'unique:course_categories,name,' . $courseCategory->id], 'description' => ['nullable', 'string']]);
        $courseCategory->update($data);
        return response()->json(['data' => $courseCategory->fresh(), 'message' => 'تم تحديث التصنيف.']);
    }

    public function destroy(CourseCategory $courseCategory): JsonResponse
    {
        if ($courseCategory->courses()->exists()) {
            return response()->json(['message' => 'لا يمكن حذف تصنيف مرتبط بكورسات.'], 422);
        }

        $courseCategory->delete();
        return response()->json(['message' => 'تم حذف التصنيف.']);
    }

    public function uploadImage(Request $request, CourseCategory $courseCategory): JsonResponse
    {
        $data = $request->validate(['file' => ['required', 'file', 'max:10240', 'mimetypes:image/jpeg,image/png,image/webp']]);
        $media = $this->cloudinary->upload($data['file'], 'categories/'.$courseCategory->id);
        $courseCategory->update(['image_url' => $media['url'], 'image_public_id' => $media['public_id']]);
        return response()->json(['data' => $courseCategory->fresh(), 'message' => 'تم رفع صورة التصنيف.']);
    }
}