<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * عرض صفحة تسجيل الدخول
     */
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * معالجة تسجيل الدخول
     */
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|regex:/^07[0-9]{9}$/',
            'password' => 'required|string',
        ], [
            'phone.required' => 'رقم الهاتف مطلوب',
            'phone.regex' => 'رقم الهاتف يجب أن يكون عراقي صحيح (مثال: 07701234567)',
            'password.required' => 'كلمة المرور مطلوبة',
        ]);

        if (Auth::attempt(['phone' => $request->phone, 'password' => $request->password], $request->remember)) {
            $request->session()->regenerate();

            $user = Auth::user();

            // توجيه حسب نوع المستخدم
            if ($user->role === 'admin') {
                return redirect()->route('admin.dashboard');
            } else {
                return redirect()->route('employee.dashboard');
            }
        }

        throw ValidationException::withMessages([
            'phone' => 'رقم الهاتف أو كلمة المرور غير صحيحة.',
        ]);
    }

    /**
     * تسجيل الخروج
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
