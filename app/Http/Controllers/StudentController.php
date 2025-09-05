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
        $student->load(['university', 'documents']);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'stage' => 'required|in:بكالوريوس,ماجستير,دكتوراه',
            'gpa' => 'nullable|numeric|min:0|max:100',
            'university_id' => 'required|exists:universities,id',
            'date' => 'required|date',
            'mobile' => 'required|string|max:20',
            'code' => 'required|string|max:50|unique:students,code,' . $student->id,
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

        // تحديث صورة البروفايل إذا تم رفع صورة جديدة
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
                    'file_type' => $file->getMimeType(),
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
}
