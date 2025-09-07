<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'department',
        'stage',
        'university_id',
        'mobile',
        'gpa',
        'agent_name', // اسم المعقب
        'pdf_file', // الملف الجديد
        'application_number', // رقم الطلب
        'status',
        'admin_notes',
        'reviewed_at',
        'reviewed_by',
        'student_id' // ربط مع الطالب بعد القبول
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
        'gpa' => 'decimal:2',
    ];

    /**
     * علاقة مع الجامعة
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * علاقة مع المراجع (المستخدم الذي راجع الطلب)
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /**
     * علاقة مع الطالب (بعد القبول)
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * تحديد لون الحالة
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800'
        };
    }

    /**
     * نص الحالة باللغة العربية
     */
    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'pending' => 'معلق',
            'approved' => 'مقبول',
            'rejected' => 'مرفوض',
            default => 'غير محدد'
        };
    }
}
