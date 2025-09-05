<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * عرض قائمة الموظفين
     */
    public function index()
    {
        $employees = User::where('role', 'employee')
            ->select('id', 'name', 'phone', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Pages/Employees', [
            'employees' => $employees
        ]);
    }

    /**
     * إضافة موظف جديد
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|regex:/^07[0-9]{9}$/|unique:users,phone',
            'password' => 'required|string|min:6',
        ], [
            'name.required' => 'اسم الموظف مطلوب',
            'name.max' => 'اسم الموظف يجب أن يكون أقل من 255 حرف',
            'phone.required' => 'رقم الهاتف مطلوب',
            'phone.regex' => 'رقم الهاتف يجب أن يكون عراقي صحيح (مثال: 07701234567)',
            'phone.unique' => 'رقم الهاتف مسجل مسبقاً',
            'password.required' => 'كلمة المرور مطلوبة',
            'password.min' => 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
        ]);

        User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'employee',
        ]);

        return redirect()->back()->with('message', 'تم إضافة الموظف بنجاح');
    }

    /**
     * تحديث بيانات الموظف
     */
    public function update(Request $request, User $employee)
    {
        // التأكد من أن المستخدم موظف وليس أدمن
        if ($employee->role !== 'employee') {
            return redirect()->back()->with('error', 'لا يمكن تعديل بيانات المشرف');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => [
                'required',
                'string',
                'regex:/^07[0-9]{9}$/',
                Rule::unique('users')->ignore($employee->id),
            ],
            'password' => 'nullable|string|min:6',
        ], [
            'name.required' => 'اسم الموظف مطلوب',
            'name.max' => 'اسم الموظف يجب أن يكون أقل من 255 حرف',
            'phone.required' => 'رقم الهاتف مطلوب',
            'phone.regex' => 'رقم الهاتف يجب أن يكون عراقي صحيح (مثال: 07701234567)',
            'phone.unique' => 'رقم الهاتف مسجل مسبقاً',
            'password.min' => 'كلمة المرور يجب أن تكون على الأقل 6 أحرف',
        ]);

        $updateData = [
            'name' => $request->name,
            'phone' => $request->phone,
        ];

        // تحديث كلمة المرور فقط إذا تم إدخالها
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $employee->update($updateData);

        return redirect()->back()->with('message', 'تم تحديث بيانات الموظف بنجاح');
    }

    /**
     * حذف الموظف
     */
    public function destroy(User $employee)
    {
        // التأكد من أن المستخدم موظف وليس أدمن
        if ($employee->role !== 'employee') {
            return redirect()->back()->with('error', 'لا يمكن حذف المشرف');
        }

        $employee->delete();

        return redirect()->back()->with('message', 'تم حذف الموظف بنجاح');
    }
}
