<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UniversityController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ApplicationController;

// Redirect to appropriate dashboard if already logged in
Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        if ($user->role === 'admin') {
            return redirect()->route('admin.dashboard');
        } else {
            return redirect()->route('employee.dashboard');
        }
    }
    return redirect()->route('login');
})->name('home');

// Public Application Form (accessible to everyone)
Route::get('/apply', [ApplicationController::class, 'showApplicationForm'])->name('application.form');
Route::post('/apply', [ApplicationController::class, 'submitApplication'])->name('application.submit');

// Public Admissions Check (accessible to everyone)
Route::get('/admissions', [ApplicationController::class, 'showAdmissionsCheck'])->name('admissions.check');
Route::post('/admissions/check', [ApplicationController::class, 'checkApplication'])->name('admissions.search');

// Public PDF Downloads (accessible to everyone)
Route::get('/application/{application_number}/pdf', [ApplicationController::class, 'downloadApplicationPDF'])->name('application.pdf');
Route::get('/student/{student}/pdf', [ApplicationController::class, 'downloadStudentPDF'])->name('student.pdf');

// Authentication Routes
Route::middleware(['guest'])->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Protected Routes
Route::middleware(['auth'])->group(function () {
    // Admin Dashboard
    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard')->middleware('role:admin');

    // Employee Dashboard
    Route::get('/employee/dashboard', function () {
        return Inertia::render('Employee/Dashboard');
    })->name('employee.dashboard')->middleware('role:employee');

    // الصفحات الخمسة - متاحة للجميع
    Route::get('/admin/employees', [EmployeeController::class, 'index'])->name('employees')->middleware('role:admin');
    Route::post('/admin/employees', [EmployeeController::class, 'store'])->name('employees.store')->middleware('role:admin');
    Route::put('/admin/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update')->middleware('role:admin');
    Route::delete('/admin/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy')->middleware('role:admin');

    Route::get('/admin/students', [StudentController::class, 'index'])->name('students');
    Route::get('/admin/students/{student}/profile', [StudentController::class, 'profile'])->name('students.profile');
    Route::post('/admin/students', [StudentController::class, 'store'])->name('students.store');
    Route::put('/admin/students/{student}', [StudentController::class, 'update'])->name('students.update');
    Route::delete('/admin/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
    Route::post('/admin/students/{student}/pdf-export', [StudentController::class, 'generateCompletePDF'])->name('students.pdf.export');
    Route::delete('/admin/students/documents/{document}', [StudentController::class, 'deleteDocument'])->name('students.documents.delete');
    Route::get('/admin/students/documents/{document}/download', [StudentController::class, 'downloadDocument'])->name('students.documents.download');

    Route::get('/admin/orders', [ApplicationController::class, 'index'])->name('orders');
    Route::put('/admin/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->name('applications.updateStatus');
    Route::post('/admin/applications/{application}/convert', [ApplicationController::class, 'convertToStudent'])->name('applications.convert');

    Route::get('/admin/universities', [UniversityController::class, 'index'])->name('universities');
    Route::post('/admin/universities', [UniversityController::class, 'store'])->name('universities.store');
    Route::put('/admin/universities/{university}', [UniversityController::class, 'update'])->name('universities.update');
    Route::delete('/admin/universities/{university}', [UniversityController::class, 'destroy'])->name('universities.destroy');

    Route::get('/admin/statistics', function () {
        return Inertia::render('Pages/Statistics');
    })->name('statistics');
});

// Old dashboard route (for testing)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');
