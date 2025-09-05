<?php

namespace App\Http\Controllers;

use App\Models\StudentApplication;
use App\Models\University;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ApplicationController extends Controller
{
    /**
     * عرض نموذج التقديم للطلاب (صفحة عامة)
     */
    public function showApplicationForm()
    {
        $universities = University::orderBy('name')->get();

        return Inertia::render('Public/ApplicationForm', [
            'universities' => $universities
        ]);
    }

    /**
     * حفظ طلب التسجيل من الطالب
     */
    public function submitApplication(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'stage' => 'required|string|in:بكالوريوس,ماجستير,دكتوراه',
            'university_id' => 'required|exists:universities,id',
            'mobile' => 'required|string|regex:/^07[0-9]{9}$/',
            'gpa' => 'nullable|numeric|min:0|max:100',
            'profile_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'passport_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'certificate_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'name.required' => 'اسم الطالب مطلوب',
            'department.required' => 'القسم مطلوب',
            'stage.required' => 'المرحلة مطلوبة',
            'university_id.required' => 'الجامعة مطلوبة',
            'mobile.required' => 'رقم الموبايل مطلوب',
            'mobile.regex' => 'رقم الموبايل يجب أن يكون عراقي صحيح',
            'profile_image.required' => 'الصورة الشخصية مطلوبة',
            'passport_image.required' => 'صورة جواز السفر مطلوبة',
            'certificate_image.required' => 'صورة الشهادة مطلوبة',
        ]);

        $applicationData = $request->only(['name', 'department', 'stage', 'university_id', 'mobile', 'gpa']);

        // رفع الصور
        if ($request->hasFile('profile_image')) {
            $applicationData['profile_image'] = $request->file('profile_image')->store('applications/profiles', 'public');
        }

        if ($request->hasFile('passport_image')) {
            $applicationData['passport_image'] = $request->file('passport_image')->store('applications/passports', 'public');
        }

        if ($request->hasFile('certificate_image')) {
            $applicationData['certificate_image'] = $request->file('certificate_image')->store('applications/certificates', 'public');
        }

        StudentApplication::create($applicationData);

        return redirect()->back()->with('success', 'تم إرسال طلبك بنجاح! سيتم مراجعته والرد عليك قريباً.');
    }

    /**
     * عرض قائمة الطلبات للإدارة
     */
    public function index()
    {
        $applications = StudentApplication::with(['university', 'reviewer'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Pages/Orders', [
            'applications' => $applications,
            'user' => auth()->user()
        ]);
    }

    /**
     * تحديث حالة الطلب
     */
    public function updateStatus(Request $request, StudentApplication $application)
    {
        $request->validate([
            'status' => 'required|in:pending,rejected',
            'admin_notes' => 'nullable|string'
        ]);

        // التأكد من أن المستخدم الحالي موجود
        $user = auth()->user();
        if (!$user || !$user->id) {
            return redirect()->back()->with('error', 'خطأ في بيانات المستخدم');
        }

        $application->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => $user->id
        ]);

        return redirect()->back()->with('message', 'تم تحديث حالة الطلب بنجاح');
    }

    /**
     * قبول الطلب وإضافة الطالب إلى النظام
     */
    public function convertToStudent(Request $request, StudentApplication $application)
    {
        // يمكن قبول الطلبات المعلقة أو المرفوضة فقط
        // لا يمكن قبول الطلبات المقبولة مسبقاً
        if ($application->status === 'approved') {
            return redirect()->route('orders')->with('error', 'هذا الطلب تم قبوله مسبقاً');
        }

        // التحقق من عدم وجود طالب بنفس رقم الموبايل مسبقاً
        if (Student::where('mobile', $application->mobile)->exists()) {
            return redirect()->route('orders')->with('error', 'يوجد طالب مسجل بنفس رقم الموبايل مسبقاً');
        }

        $request->validate([
            'code' => 'required|string|unique:students,code',
            'date' => 'nullable|date',
            'installment_total' => 'nullable|numeric|min:0',
            'installment_received' => 'nullable|numeric|min:0',
            'installment_remaining' => 'nullable|numeric|min:0',
            'fees_total' => 'nullable|numeric|min:0',
            'fees_received' => 'nullable|numeric|min:0',
            'fees_remaining' => 'nullable|numeric|min:0',
            'sender_agent' => 'nullable|string',
            'sender_agent_fees' => 'nullable|numeric|min:0',
            'receiver_agent' => 'nullable|string',
            'receiver_agent_fees' => 'nullable|numeric|min:0',
        ], [
            'code.unique' => 'هذا الكود مستخدم من قبل طالب آخر'
        ]);

        // تحديث حالة الطلب أولاً لمنع التداخل
        $application->update(['status' => 'approved']);

        // إنشاء الطالب الجديد
        $studentData = [
            'name' => $application->name,
            'department' => $application->department,
            'stage' => $application->stage,
            'university_id' => $application->university_id,
            'mobile' => $application->mobile,
            'gpa' => $application->gpa,
            'code' => $request->code,
            'date' => $request->date,
            'installment_total' => $request->installment_total ?? 0,
            'installment_received' => $request->installment_received ?? 0,
            'installment_remaining' => $request->installment_remaining ?? 0,
            'fees_total' => $request->fees_total ?? 0,
            'fees_received' => $request->fees_received ?? 0,
            'fees_remaining' => $request->fees_remaining ?? 0,
            'sender_agent' => $request->sender_agent,
            'sender_agent_fees' => $request->sender_agent_fees ?? 0,
            'receiver_agent' => $request->receiver_agent,
            'receiver_agent_fees' => $request->receiver_agent_fees ?? 0,
        ];

        // نسخ الصورة الشخصية
        if ($application->profile_image) {
            $oldPath = $application->profile_image;
            $newPath = str_replace('applications/profiles', 'students/profiles', $oldPath);
            Storage::disk('public')->copy($oldPath, $newPath);
            $studentData['profile_image'] = $newPath;
        }

        $student = Student::create($studentData);

        // نسخ وحفظ المستندات
        if ($application->passport_image) {
            $oldPath = $application->passport_image;
            $newPath = str_replace('applications/passports', 'students/documents', $oldPath);
            Storage::disk('public')->copy($oldPath, $newPath);

            $student->documents()->create([
                'file_name' => 'صورة جواز السفر',
                'file_path' => $newPath,
                'mime_type' => Storage::disk('public')->mimeType($newPath)
            ]);
        }

        if ($application->certificate_image) {
            $oldPath = $application->certificate_image;
            $newPath = str_replace('applications/certificates', 'students/documents', $oldPath);
            Storage::disk('public')->copy($oldPath, $newPath);

            $student->documents()->create([
                'file_name' => 'صورة الشهادة',
                'file_path' => $newPath,
                'mime_type' => Storage::disk('public')->mimeType($newPath)
            ]);
        }

        // إضافة ملاحظات ومراجع الطلب
        $user = auth()->user();
        $application->update([
            'admin_notes' => 'تم قبول الطلب وإضافة الطالب إلى النظام',
            'reviewed_at' => now(),
            'reviewed_by' => $user ? $user->id : null
        ]);

        return redirect()->route('orders')->with('message', 'تم قبول الطلب وإضافة الطالب بنجاح');
    }
}
