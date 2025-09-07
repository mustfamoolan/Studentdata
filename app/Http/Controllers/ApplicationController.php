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
            'agent_name' => 'nullable|string|max:255',
            'pdf_file' => 'required|file|mimes:pdf|max:10240', // 10MB max
        ], [
            'name.required' => 'اسم الطالب مطلوب',
            'department.required' => 'القسم مطلوب',
            'stage.required' => 'المرحلة مطلوبة',
            'university_id.required' => 'الجامعة مطلوبة',
            'mobile.required' => 'رقم الموبايل مطلوب',
            'mobile.regex' => 'رقم الموبايل يجب أن يكون عراقي صحيح',
            'agent_name.max' => 'اسم المعقب يجب أن لا يزيد عن 255 حرف',
            'pdf_file.required' => 'ملف PDF مطلوب',
            'pdf_file.mimes' => 'الملف يجب أن يكون من نوع PDF',
            'pdf_file.max' => 'حجم الملف يجب أن لا يزيد عن 10 ميجابايت',
        ]);

        $applicationData = $request->only(['name', 'department', 'stage', 'university_id', 'mobile', 'gpa', 'agent_name']);

        // إنشاء رقم طلب فريد
        $applicationData['application_number'] = $this->generateApplicationNumber();

        // تحديد الحالة الافتراضية
        $applicationData['status'] = 'pending';

        // رفع ملف PDF
        if ($request->hasFile('pdf_file')) {
            $applicationData['pdf_file'] = $request->file('pdf_file')->store('applications/documents', 'public');
        }

        $application = StudentApplication::create($applicationData);

        return Inertia::render('Public/ApplicationSuccess', [
            'application' => $application->load('university')
        ]);
    }

    /**
     * إنشاء رقم طلب فريد
     */
    private function generateApplicationNumber()
    {
        $year = date('Y');
        $month = date('m');
        $day = date('d');

        // البحث عن آخر رقم في نفس اليوم
        $lastNumber = StudentApplication::whereDate('created_at', today())
            ->count() + 1;

        return sprintf('APP-%s-%s%s-%06d', $year, $month, $day, $lastNumber);
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
            'date' => 'nullable',
            'installment_total' => 'nullable',
            'installment_received' => 'nullable',
            'installment_remaining' => 'nullable',
            'fees_total' => 'nullable',
            'fees_received' => 'nullable',
            'fees_remaining' => 'nullable',
            'sender_agent' => 'nullable',
            'sender_agent_fees' => 'nullable',
            'receiver_agent' => 'nullable',
            'receiver_agent_fees' => 'nullable',
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
            'installment_total' => is_numeric($request->installment_total) ? (float)$request->installment_total : 0,
            'installment_received' => is_numeric($request->installment_received) ? (float)$request->installment_received : 0,
            'installment_remaining' => is_numeric($request->installment_remaining) ? (float)$request->installment_remaining : 0,
            'fees_total' => is_numeric($request->fees_total) ? (float)$request->fees_total : 0,
            'fees_received' => is_numeric($request->fees_received) ? (float)$request->fees_received : 0,
            'fees_remaining' => is_numeric($request->fees_remaining) ? (float)$request->fees_remaining : 0,
            'sender_agent' => $request->sender_agent,
            'sender_agent_fees' => is_numeric($request->sender_agent_fees) ? (float)$request->sender_agent_fees : 0,
            'receiver_agent' => $request->receiver_agent,
            'receiver_agent_fees' => is_numeric($request->receiver_agent_fees) ? (float)$request->receiver_agent_fees : 0,
        ];

        // نسخ الصورة الشخصية
        if ($application->profile_image) {
            $oldPath = $application->profile_image;
            $newPath = str_replace('applications/profiles', 'students/profiles', $oldPath);
            Storage::disk('public')->copy($oldPath, $newPath);
            $studentData['profile_image'] = $newPath;
        }

        $student = Student::create($studentData);

        // نسخ ملف PDF كمستند للطالب
        if ($application->pdf_file) {
            $oldPath = $application->pdf_file;
            $newPath = str_replace('applications/documents', 'students/documents', $oldPath);
            Storage::disk('public')->copy($oldPath, $newPath);

            // الحصول على حجم الملف
            $fileSize = Storage::disk('public')->size($newPath);

            $student->documents()->create([
                'file_name' => 'مستندات الطلب الأصلي',
                'file_path' => $newPath,
                'file_type' => 'document',
                'mime_type' => 'application/pdf',
                'file_size' => $fileSize ?? 0
            ]);
        }

        // ربط الطلب بالطالب
        $application->update([
            'student_id' => $student->id,
            'admin_notes' => 'تم قبول الطلب وإضافة الطالب إلى النظام',
            'reviewed_at' => now(),
            'reviewed_by' => auth()->user() ? auth()->user()->id : null
        ]);

        return redirect()->route('orders')->with('message', 'تم قبول الطلب وإضافة الطالب بنجاح');
    }

    /**
     * عرض صفحة الاستعلام عن القبولات
     */
    public function showAdmissionsCheck()
    {
        return Inertia::render('Public/AdmissionsCheck');
    }

    /**
     * البحث عن طلب بالرقم
     */
    public function checkApplication(Request $request)
    {
        $request->validate([
            'application_number' => 'required|string'
        ], [
            'application_number.required' => 'رقم الطلب مطلوب'
        ]);

        $application = StudentApplication::with(['university', 'student'])
            ->where('application_number', $request->application_number)
            ->first();

        if (!$application) {
            return redirect()->back()->with('error', 'رقم الطلب غير صحيح أو غير موجود');
        }

        return Inertia::render('Public/AdmissionsCheck', [
            'application' => $application
        ]);
    }

    /**
     * تحميل ملف PDF لاستمارة الطلب
     */
    public function downloadApplicationPDF($application_number)
    {
        $application = StudentApplication::with('university')
            ->where('application_number', $application_number)
            ->firstOrFail();

        // استخدام mPDF لإنشاء PDF
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'default_font_size' => 12,
            'default_font' => 'DejaVuSans',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 15,
            'margin_bottom' => 15,
        ]);

        $html = view('pdf.application', compact('application'))->render();
        $mpdf->WriteHTML($html);

        return response($mpdf->Output('', 'S'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="application-' . $application_number . '.pdf"');
    }

    /**
     * تحميل ملف PDF للطالب الكامل
     */
    public function downloadStudentPDF(Student $student)
    {
        $student->load(['university', 'documents']);

        // التأكد من أن الطالب مقبول
        $application = StudentApplication::where('student_id', $student->id)->first();
        if (!$application || $application->status !== 'approved') {
            abort(404, 'غير مسموح بتحميل هذا الملف');
        }

        // استخدام mPDF لإنشاء PDF
        $mpdf = new \Mpdf\Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'default_font_size' => 12,
            'default_font' => 'DejaVuSans',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 15,
            'margin_bottom' => 15,
        ]);

        $html = view('pdf.student', compact('student', 'application'))->render();
        $mpdf->WriteHTML($html);

        return response($mpdf->Output('', 'S'))
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="student-' . $student->student_number . '.pdf"');
    }
}
