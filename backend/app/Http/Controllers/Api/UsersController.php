<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UsersController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->query('role');
        
        $query = User::query()->with(['roles', 'permissions']);
        
        if ($role) {
            $query->whereHas('roles', function ($q) use ($role) {
                $q->where('name', ucfirst($role));
            });
        }
        
        $users = $query->get();
        
        return response()->json([
            'data' => UserResource::collection($users),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:30'],
            'avatar_url' => ['nullable', 'url', 'max:2048'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'specialty' => ['nullable', 'string', 'max:255'],
            'academic_id' => ['nullable', 'string', 'max:50', 'unique:users'],
            'teaching_category_id' => ['nullable', 'integer', 'exists:course_categories,id'],
            'status' => ['sometimes', 'in:active,inactive'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'role' => ['required', 'string', 'in:admin,teacher,student'],
        ]);

        $user = User::query()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'avatar_url' => $validated['avatar_url'] ?? null,
            'bio' => $validated['bio'] ?? null,
            'specialty' => $validated['specialty'] ?? null,
            'academic_id' => $validated['academic_id'] ?? null,
            'teaching_category_id' => $validated['teaching_category_id'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        $user->assignRole(ucfirst($validated['role']));

        return response()->json([
            'data' => UserResource::make($user->load(['roles', 'permissions'])),
            'message' => 'تم إنشاء المستخدم بنجاح.',
        ], 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'data' => UserResource::make($user->load(['roles', 'permissions'])),
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'avatar_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'specialty' => ['sometimes', 'nullable', 'string', 'max:255'],
            'academic_id' => ['sometimes', 'nullable', 'string', 'max:50', 'unique:users,academic_id,' . $user->id],
            'teaching_category_id' => ['sometimes', 'nullable', 'integer', 'exists:course_categories,id'],
            'status' => ['sometimes', 'in:active,inactive'],
            'password' => ['sometimes', 'confirmed', Password::defaults()],
            'role' => ['sometimes', 'string', 'in:admin,teacher,student'],
        ]);

        $user->fill(collect($validated)->only([
            'name', 'email', 'phone', 'avatar_url', 'bio', 'specialty', 'academic_id', 'teaching_category_id', 'status',
        ])->all());

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        if (isset($validated['role'])) {
            $user->syncRoles([ucfirst($validated['role'])]);
        }

        return response()->json([
            'data' => UserResource::make($user->load(['roles', 'permissions'])),
            'message' => 'تم تحديث المستخدم بنجاح.',
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'تم حذف المستخدم بنجاح.',
        ]);
    }
}
