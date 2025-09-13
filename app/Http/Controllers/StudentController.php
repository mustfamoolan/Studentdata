<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\University;
use App\Models\StudentDocument;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with(['university', 'documents'])
            ->orderBy('created_at', 'desc')
            ->get();

        $universities = University::orderBy('name')->get();

        return Inertia::render('Pages/Students', [
            'students' => $students,
            'universities' => $universities,
            'user' => auth()->user()
        ]);
    }

    /**
     * Show the student profile page.
     */
    public function profile(Student $student)
    {
        $student->load(['university', 'documents', 'application']);
        $universities = University::orderBy('name')->get();

        return Inertia::render('Pages/StudentProfile', [
            'student' => $student,
            'universities' => $universities
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'stage' => 'required|in:بكالوريوس,ماجستير,دكتوراه',
            'gpa' => 'nullable|numeric|min:0|max:100',
            'university_id' => 'required|exists:universities,id',
            'date' => 'required|date',
            'mobile' => 'required|string|max:20',
            'code' => 'required|string|max:50|unique:students,code',
            'profile_image' => 'nullable|image|max:5120', // 5MB max for image
            'installment_total' => 'nullable|numeric|min:0',
            'installment_received' => 'nullable|numeric|min:0',
            'installment_remaining' => 'nullable|numeric|min:0',
            'fees_total' => 'nullable|numeric|min:0',
            'fees_received' => 'nullable|numeric|min:0',
            'fees_remaining' => 'nullable|numeric|min:0',
            'sender_agent' => 'nullable|string|max:255',
            'sender_agent_fees' => 'nullable|numeric|min:0',
            'receiver_agent' => 'nullable|string|max:255',
            'receiver_agent_fees' => 'nullable|numeric|min:0',
            'documents.*' => 'nullable|file|max:10240' // 10MB max per file
        ]);

        // رفع صورة البروفايل
        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('students/profiles', $imageName, 'public');
            $validated['profile_image'] = $imagePath;
        }

        $student = Student::create($validated);

        // رفع المستندات
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $fileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();
                $storedName = Str::uuid() . '.' . $fileExtension;
                $filePath = $file->storeAs('students/' . $student->id, $storedName, 'public');

                StudentDocument::create([
                    'student_id' => $student->id,
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'file_type' => $this->getFileType($file->getMimeType()),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize()
                ]);
            }
        }

        return redirect()->back()->with('success', 'تم إضافة الطالب بنجاح');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student)
    {
        // التحقق من صحة البيانات بشكل مشروط
        $rules = [
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'stage' => 'required|in:بكالوريوس,ماجستير,دكتوراه',
            'gpa' => 'nullable|numeric|min:0|max:100',
            'university_id' => 'required|exists:universities,id',
            'date' => 'nullable|date',
            'mobile' => 'required|string|max:20',
            'code' => 'required|string|max:50|unique:students,code,' . $student->id,
            'installment_total' => 'nullable|numeric|min:0',
            'installment_received' => 'nullable|numeric|min:0',
            'installment_remaining' => 'nullable|numeric|min:0',
            'fees_total' => 'nullable|numeric|min:0',
            'fees_received' => 'nullable|numeric|min:0',
            'fees_remaining' => 'nullable|numeric|min:0',
            'sender_agent' => 'nullable|string|max:255',
            'sender_agent_fees' => 'nullable|numeric|min:0',
            'receiver_agent' => 'nullable|string|max:255',
            'receiver_agent_fees' => 'nullable|numeric|min:0',
        ];

        // إضافة قواعد الملفات فقط إذا كانت موجودة
        if ($request->hasFile('profile_image')) {
            $rules['profile_image'] = 'image|max:5120'; // 5MB max for image
        }
        if ($request->hasFile('documents')) {
            $rules['documents.*'] = 'file|max:10240'; // 10MB max per file
        }

        $validated = $request->validate($rules);

        // تحديث صورة البروفايل فقط إذا تم رفع صورة جديدة
        if ($request->hasFile('profile_image')) {
            // حذف الصورة القديمة إذا كانت موجودة
            if ($student->profile_image) {
                Storage::disk('public')->delete($student->profile_image);
            }

            $image = $request->file('profile_image');
            $imageName = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('students/profiles', $imageName, 'public');
            $validated['profile_image'] = $imagePath;
        }

        // تحديث البيانات
        $student->update($validated);

        // رفع المستندات الجديدة
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $fileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();
                $storedName = Str::uuid() . '.' . $fileExtension;
                $filePath = $file->storeAs('students/' . $student->id, $storedName, 'public');

                StudentDocument::create([
                    'student_id' => $student->id,
                    'file_name' => $fileName,
                    'file_path' => $filePath,
                    'file_size' => $file->getSize(),
                    'file_type' => 'document',
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        return redirect()->back()->with('success', 'تم تحديث بيانات الطالب بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        // حذف المستندات من التخزين
        foreach ($student->documents as $document) {
            Storage::disk('public')->delete($document->file_path);
        }

        $student->delete();

        return redirect()->back()->with('success', 'تم حذف الطالب بنجاح');
    }

    /**
     * Remove a document from storage.
     */
    public function deleteDocument(StudentDocument $document)
    {
        Storage::disk('public')->delete($document->file_path);
        $document->delete();

        return redirect()->back()->with('success', 'تم حذف المستند بنجاح');
    }

    /**
     * Download a document.
     */
    public function downloadDocument(StudentDocument $document)
    {
        return Storage::disk('public')->download($document->file_path, $document->file_name);
    }

    private function getFileType($mimeType)
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (in_array($mimeType, ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])) {
            return 'document';
        } else {
            return 'other';
        }
    }

    /**
     * Generate complete PDF for sharing purposes
     */
    public function generateCompletePDF(Student $student)
    {
        try {
            $student->load(['university', 'documents']);

            // تحضير البيانات
            $data = [
                'student' => $student,
                'paymentPercentage' => $student->installment_total > 0
                    ? round(($student->installment_received / $student->installment_total) * 100)
                    : 0,
                'createdAt' => now()->format('Y-m-d H:i:s')
            ];

            // حساب حالة الدفع
            $statusColor = 'red';
            $statusText = 'معلق';
            if ($data['paymentPercentage'] >= 100) {
                $statusColor = 'green';
                $statusText = 'مكتمل';
            } elseif ($data['paymentPercentage'] >= 50) {
                $statusColor = 'orange';
                $statusText = 'جزئي';
            }
            $data['statusColor'] = $statusColor;
            $data['statusText'] = $statusText;

            // إنشاء HTML محتوى
            $html = PDFTemplateController::generateStudentHTML($data);

            // إنشاء PDF
            $mpdf = new \Mpdf\Mpdf([
                'mode' => 'utf-8',
                'format' => 'A4',
                'orientation' => 'P',
                'margin_left' => 15,
                'margin_right' => 15,
                'margin_top' => 20,
                'margin_bottom' => 20,
                'default_font' => 'dejavusans',
                'dir' => 'rtl'
            ]);

            $mpdf->WriteHTML($html);
            $mpdf->SetDisplayMode('fullpage');

            // إرجاع PDF كـ response
            return response($mpdf->Output('', 'S'), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'attachment; filename="student_' . $student->code . '_' . $student->name . '.pdf"'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'حدث خطأ في إنشاء ملف PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Generate HTML content for complete student PDF
     */
    private function generateStudentHTML($data)
    {
        $student = $data['student'];
        $statusColor = $data['statusColor'];
        $statusText = $data['statusText'];
        $paymentPercentage = $data['paymentPercentage'];

        $html = '
        <style>
            body { font-family: "DejaVu Sans", sans-serif; direction: rtl; text-align: right; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 15px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            .ministry { font-size: 16px; color: #666; }
            .title { font-size: 20px; font-weight: bold; margin: 20px 0; text-align: center; }
            .section { margin-bottom: 25px; border: 1px solid #ddd; }
            .section-header { background-color: #f5f5f5; padding: 10px; font-weight: bold; border-bottom: 1px solid #ddd; }
            .content { padding: 15px; }
            .row { margin-bottom: 8px; }
            .label { font-weight: bold; color: #333; display: inline-block; width: 40%; }
            .value { color: #666; }
            .status-complete { color: green; font-weight: bold; }
            .status-partial { color: orange; font-weight: bold; }
            .status-pending { color: red; font-weight: bold; }
            .financial-section { background-color: #f9f9f9; }
            .document-list { margin-top: 10px; }
            .document-item { padding: 5px; border-bottom: 1px dotted #ccc; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>

        <div class="header">
            <div class="logo">جمهورية العراق</div>
            <div class="ministry">وزارة التعليم العالي والبحث العلمي</div>
            <div class="ministry">نظام إدارة الطلاب</div>
        </div>

        <div class="title">ملف الطالب الشامل</div>

        <!-- معلومات شخصية -->
        <div class="section">
            <div class="section-header">البيانات الشخصية</div>
            <div class="content">
                <div class="row"><span class="label">الاسم الكامل:</span> <span class="value">' . $student->name . '</span></div>
                <div class="row"><span class="label">الرقم الجامعي:</span> <span class="value">' . $student->code . '</span></div>
                <div class="row"><span class="label">رقم الهاتف:</span> <span class="value">' . $student->mobile . '</span></div>
                ' . ($student->date ? '<div class="row"><span class="label">تاريخ التسجيل:</span> <span class="value">' . date('Y-m-d', strtotime($student->date)) . '</span></div>' : '') . '
            </div>
        </div>

        <!-- معلومات أكاديمية -->
        <div class="section">
            <div class="section-header">البيانات الأكاديمية</div>
            <div class="content">
                <div class="row"><span class="label">الجامعة:</span> <span class="value">' . ($student->university->name ?? 'غير محدد') . '</span></div>
                ' . ($student->university && $student->university->location ? '<div class="row"><span class="label">موقع الجامعة:</span> <span class="value">' . $student->university->location . '</span></div>' : '') . '
                <div class="row"><span class="label">القسم:</span> <span class="value">' . $student->department . '</span></div>
                <div class="row"><span class="label">المرحلة الدراسية:</span> <span class="value">' . $student->stage . '</span></div>
                ' . ($student->gpa ? '<div class="row"><span class="label">المعدل التراكمي:</span> <span class="value">' . $student->gpa . '</span></div>' : '') . '
            </div>
        </div>

        <!-- معلومات مالية -->
        <div class="section financial-section">
            <div class="section-header">المعلومات المالية</div>
            <div class="content">
                <div class="row">
                    <span class="label">حالة الدفع:</span>
                    <span class="status-' . ($statusColor === 'green' ? 'complete' : ($statusColor === 'orange' ? 'partial' : 'pending')) . '">
                        ' . $statusText . ' (' . $paymentPercentage . '%)
                    </span>
                </div>

                <br><strong>الأقساط:</strong>
                <div class="row"><span class="label">القسط الإجمالي:</span> <span class="value">' . number_format($student->installment_total) . ' دينار عراقي</span></div>
                <div class="row"><span class="label">المبلغ المستلم:</span> <span class="value">' . number_format($student->installment_received) . ' دينار عراقي</span></div>
                <div class="row"><span class="label">المبلغ المتبقي:</span> <span class="value">' . number_format($student->installment_remaining ?: ($student->installment_total - $student->installment_received)) . ' دينار عراقي</span></div>

                <br><strong>الأجور:</strong>
                <div class="row"><span class="label">الأجور الإجمالية:</span> <span class="value">' . number_format($student->fees_total) . ' دينار عراقي</span></div>
                <div class="row"><span class="label">الأجور المستلمة:</span> <span class="value">' . number_format($student->fees_received) . ' دينار عراقي</span></div>
                <div class="row"><span class="label">الأجور المتبقية:</span> <span class="value">' . number_format($student->fees_remaining ?: ($student->fees_total - $student->fees_received)) . ' دينار عراقي</span></div>
            </div>
        </div>';

        // معلومات المعقبين
        if ($student->sender_agent || $student->receiver_agent) {
            $html .= '
            <div class="section">
                <div class="section-header">معلومات المعقبين</div>
                <div class="content">';

            if ($student->sender_agent) {
                $html .= '
                    <div class="row"><span class="label">المعقب المرسل:</span> <span class="value">' . $student->sender_agent . '</span></div>
                    <div class="row"><span class="label">أجور المعقب المرسل:</span> <span class="value">' . number_format($student->sender_agent_fees) . ' دينار عراقي</span></div>';
            }

            if ($student->receiver_agent) {
                $html .= '
                    <div class="row"><span class="label">المعقب المستلم:</span> <span class="value">' . $student->receiver_agent . '</span></div>
                    <div class="row"><span class="label">أجور المعقب المستلم:</span> <span class="value">' . number_format($student->receiver_agent_fees) . ' دينار عراقي</span></div>';
            }

            $html .= '
                </div>
            </div>';
        }

        // المستندات
        if ($student->documents && count($student->documents) > 0) {
            $html .= '
            <div class="section">
                <div class="section-header">المستندات المرفقة (' . count($student->documents) . ' مستند)</div>
                <div class="content">
                    <div class="document-list">';

            foreach ($student->documents as $doc) {
                $html .= '
                        <div class="document-item">
                            <strong>' . $doc->file_name . '</strong><br>
                            <small>النوع: ' . $doc->file_type . ' | الحجم: ' . ($doc->file_size ? round($doc->file_size / 1024 / 1024, 2) . ' ميجابايت' : 'غير محدد') . '</small>
                        </div>';
            }

            $html .= '
                    </div>
                </div>
            </div>';
        }

        $html .= '
        <div class="footer">
            <div>تم إنشاء هذا التقرير في: ' . date('Y-m-d H:i:s') . '</div>
            <div>نظام إدارة الطلاب - وزارة التعليم العالي والبحث العلمي - جمهورية العراق</div>
        </div>';

        return $html;
    }
}
