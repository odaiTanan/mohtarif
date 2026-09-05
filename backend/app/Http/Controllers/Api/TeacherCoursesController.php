<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseResource;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Models\CourseLesson;
use App\Models\CourseWorkshop;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TeacherCoursesController extends Controller
{
    public function __construct(private readonly CloudinaryService $cloudinary) {}

    public function index(Request $request): mixed
    {
        return CourseResource::collection($this->ownedCourses($request)->latest()->paginate(15));
    }

    public function show(Request $request, Course $course): CourseResource
    {
        $this->authorizeCourse($request, $course);
        return new CourseResource($course->load(['category', 'instructor', 'lessons', 'workshops', 'lectures'])->loadCount(['enrollments', 'lessons', 'workshops', 'lectures']));
    }

    public function uploadMedia(Request $request, Course $course): CourseResource
    {
        $this->authorizeCourse($request, $course);
        $data = $request->validate(['file' => ['required', 'file', 'max:51200', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime']]);
        $media = $this->cloudinary->upload($data['file'], 'courses/'.$course->id);
        $course->update(['thumbnail_url' => $media['url'], 'thumbnail_public_id' => $media['public_id']]);
        return new CourseResource($course->fresh()->load(['category', 'instructor']));
    }

    public function uploadContentMedia(Request $request, Course $course, string $contentType, int $content): JsonResponse
    {
        $this->authorizeCourse($request, $course);
        $data = $request->validate(['file' => ['required', 'file', 'max:102400', 'mimetypes:image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime']]);
        $model = match ($contentType) {
            'lessons' => CourseLesson::where('course_id', $course->id)->findOrFail($content),
            'workshops' => CourseWorkshop::where('course_id', $course->id)->findOrFail($content),
            'lectures' => CourseLecture::where('course_id', $course->id)->findOrFail($content),
            default => abort(404),
        };
        $media = $this->cloudinary->upload($data['file'], 'courses/'.$course->id.'/'.$contentType);
        $field = $contentType === 'lessons' ? 'video_url' : ($contentType === 'workshops' ? 'image_url' : 'recording_url');
        $model->update([$field => $media['url']]);
        return response()->json(['data' => $model->fresh()]);
    }

    public function storeLesson(Request $request, Course $course): JsonResponse
    {
        $this->authorizeCourse($request, $course);
        return response()->json(['data' => $course->lessons()->create($request->validate($this->lessonRules()))], 201);
    }

    public function updateLesson(Request $request, Course $course, CourseLesson $lesson): JsonResponse
    {
        $this->authorizeContent($request, $course, $lesson);
        $lesson->update($request->validate($this->lessonRules(true)));
        return response()->json(['data' => $lesson->fresh()]);
    }

    public function destroyLesson(Request $request, Course $course, CourseLesson $lesson): JsonResponse
    {
        $this->authorizeContent($request, $course, $lesson);
        $lesson->delete();
        return response()->json(['message' => 'تم حذف الدرس.']);
    }

    public function storeWorkshop(Request $request, Course $course): JsonResponse
    {
        $this->authorizeCourse($request, $course);
        return response()->json(['data' => $course->workshops()->create($request->validate($this->workshopRules()))], 201);
    }

    public function updateWorkshop(Request $request, Course $course, CourseWorkshop $workshop): JsonResponse
    {
        $this->authorizeContent($request, $course, $workshop);
        $workshop->update($request->validate($this->workshopRules(true)));
        return response()->json(['data' => $workshop->fresh()]);
    }

    public function destroyWorkshop(Request $request, Course $course, CourseWorkshop $workshop): JsonResponse
    {
        $this->authorizeContent($request, $course, $workshop);
        $workshop->delete();
        return response()->json(['message' => 'تم حذف الورشة.']);
    }

    public function storeLecture(Request $request, Course $course): JsonResponse
    {
        $this->authorizeCourse($request, $course);
        return response()->json(['data' => $course->lectures()->create($request->validate($this->lectureRules()))], 201);
    }

    public function updateLecture(Request $request, Course $course, CourseLecture $lecture): JsonResponse
    {
        $this->authorizeContent($request, $course, $lecture);
        $lecture->update($request->validate($this->lectureRules(true)));
        return response()->json(['data' => $lecture->fresh()]);
    }

    public function destroyLecture(Request $request, Course $course, CourseLecture $lecture): JsonResponse
    {
        $this->authorizeContent($request, $course, $lecture);
        $lecture->delete();
        return response()->json(['message' => 'تم حذف المحاضرة.']);
    }

    private function ownedCourses(Request $request)
    {
        return Course::query()->where('instructor_id', $request->user()->id)->with(['category', 'instructor'])->withCount(['enrollments', 'lessons', 'workshops', 'lectures']);
    }

    private function authorizeCourse(Request $request, Course $course): void
    {
        abort_unless($course->instructor_id === $request->user()->id, 403, 'لا تملك صلاحية إدارة هذا الكورس.');
    }

    private function authorizeContent(Request $request, Course $course, $content): void
    {
        $this->authorizeCourse($request, $course);
        abort_unless($content->course_id === $course->id, 404);
    }

    private function lessonRules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        return ['title' => [$required, 'string', 'max:255'], 'description' => ['sometimes', 'nullable', 'string'], 'video_url' => ['sometimes', 'nullable', 'url', 'max:2048'], 'sort_order' => ['sometimes', 'integer', 'min:0'], 'is_published' => ['sometimes', 'boolean']];
    }

    private function workshopRules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        return ['title' => [$required, 'string', 'max:255'], 'description' => ['sometimes', 'nullable', 'string'], 'image_url' => ['sometimes', 'nullable', 'url', 'max:2048'], 'scheduled_at' => ['sometimes', 'nullable', 'date'], 'duration_minutes' => ['sometimes', 'nullable', 'integer', 'min:1'], 'sort_order' => ['sometimes', 'integer', 'min:0']];
    }

    private function lectureRules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';
        return ['title' => [$required, 'string', 'max:255'], 'description' => ['sometimes', 'nullable', 'string'], 'meeting_url' => ['sometimes', 'nullable', 'url', 'max:2048'], 'recording_url' => ['sometimes', 'nullable', 'url', 'max:2048'], 'scheduled_at' => ['sometimes', 'nullable', 'date'], 'duration_minutes' => ['sometimes', 'nullable', 'integer', 'min:1'], 'status' => ['sometimes', 'in:scheduled,live,completed,cancelled']];
    }
}
