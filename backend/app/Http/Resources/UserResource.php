<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'avatar_url' => $this->avatar_url,
            'avatar_public_id' => $this->avatar_public_id,
            'bio' => $this->bio,
            'specialty' => $this->specialty,
            'academic_id' => $this->academic_id,
            'teaching_category_id' => $this->teaching_category_id,
            'teaching_category' => $this->whenLoaded('teachingCategory', fn () => ['id' => $this->teachingCategory->id, 'name' => $this->teachingCategory->name]),
            'status' => $this->status,
            'roles' => $this->roles->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                ];
            }),
            'permissions' => $this->getAllPermissions()->pluck('name'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
