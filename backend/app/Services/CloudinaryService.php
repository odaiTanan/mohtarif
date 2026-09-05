<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public function upload(UploadedFile $file, string $folder): array
    {
        $cloudinary = new Cloudinary(config('services.cloudinary.url'));
        $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
            'resource_type' => 'auto',
            'folder' => trim(config('services.cloudinary.folder').'/'.$folder, '/'),
            'use_filename' => true,
            'unique_filename' => true,
        ]);

        return [
            'url' => $result['secure_url'],
            'public_id' => $result['public_id'],
            'resource_type' => $result['resource_type'] ?? null,
            'duration' => $result['duration'] ?? null,
        ];
    }
}
