<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseCategory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CoursesController extends Controller
{
    public function index(): mixed
    {
        return CourseResource::collection(Course::query()->with(['category', 'instructor'])->withCount('enrollments')->latest()->paginate(15));
    }

    public function categories(): JsonResponse
    {
        return response()->json(['data' => CourseCategory::query()->orderBy('name')->get(['id', 'name', 'slug'])]);
    }

    public function instructors(Request $request): JsonResponse
    {
        $query = User::role('Teacher')->where('status', 'active');
        if ($request->filled('category_id')) {
            $query->where('teaching_category_id', $request->integer('category_id'));
        }
        return response()->json(['data' => $query->orderBy('name')->get(['id', 'name', 'email', 'avatar_url', 'teaching_category_id'])]);
    }

    public function store(Request $request): CourseResource
    {
        $course = Course::query()->create($this->validated($request));
        return new CourseResource($course->load(['category', 'instructor'])->loadCount('enrollments'));
    }

    public function show(Course $course): CourseResource
    {
        return new CourseResource($course->load(['category', 'instructor'])->loadCount('enrollments'));
    }

    public function update(Request $request, Course $course): CourseResource
    {
        $course->update($this->validated($request, true));
        return new CourseResource($course->load(['category', 'instructor'])->loadCount('enrollments'));
    }

    public function destroy(Course $course): JsonResponse
    {
        DB::transaction(fn () => $course->delete());
        return response()->json(['message' => 'تم حذف الكورس بنجاح.']);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        $data = $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'category_id' => [$required, 'integer', 'exists:course_categories,id'],
            'instructor_id' => [$required, 'integer', 'exists:users,id'],
            'status' => ['sometimes', 'in:draft,published,archived'],
            'level' => ['sometimes', 'in:beginner,intermediate,advanced'],
            'max_students' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'thumbnail_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'course_type' => ['sometimes', 'in:technical,craft'],
        ]);

        $categoryId = $data['category_id'] ?? ($partial ? $request->route('course')->category_id : null);
        $instructorId = $data['instructor_id'] ?? ($partial ? $request->route('course')->instructor_id : null);
        if ($categoryId && $instructorId) {
            $matchesCategory = User::role('Teacher')->whereKey($instructorId)->where('teaching_category_id', $categoryId)->exists();
            if (!$matchesCategory) {
                throw ValidationException::withMessages(['instructor_id' => 'المدرس لا ينتمي إلى تصنيف الكورس.']);
            }
        }

        return $data;
    }
}