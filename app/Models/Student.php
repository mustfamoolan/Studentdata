<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'name',
        'department',
        'stage',
        'gpa',
        'university_id',
        'date',
        'mobile',
        'code',
        'profile_image',
        'installment_total',
        'installment_received',
        'installment_remaining',
        'fees_total',
        'fees_received',
        'fees_remaining',
        'sender_agent',
        'sender_agent_fees',
        'receiver_agent',
        'receiver_agent_fees'
    ];

    protected $casts = [
        'date' => 'date',
        'gpa' => 'decimal:2',
        'installment_total' => 'decimal:2',
        'installment_received' => 'decimal:2',
        'installment_remaining' => 'decimal:2',
        'fees_total' => 'decimal:2',
        'fees_received' => 'decimal:2',
        'fees_remaining' => 'decimal:2',
        'sender_agent_fees' => 'decimal:2',
        'receiver_agent_fees' => 'decimal:2'
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(StudentApplication::class, 'id', 'student_id');
    }

    // حساب المبلغ المتبقي تلقائياً
    protected static function booted()
    {
        static::saving(function ($student) {
            $student->installment_remaining = $student->installment_total - $student->installment_received;
            $student->fees_remaining = $student->fees_total - $student->fees_received;
        });
    }
}
