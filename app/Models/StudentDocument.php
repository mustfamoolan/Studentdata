<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentDocument extends Model
{
    protected $fillable = [
        'student_id',
        'file_name',
        'file_path',
        'file_type',
        'mime_type',
        'file_size'
    ];

    protected $attributes = [
        'file_type' => 'document',
        'file_size' => 0
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    // تحديد ما إذا كان الملف صورة
    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }

    // الحصول على حجم الملف مُنسق
    public function getFormattedSizeAttribute(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
