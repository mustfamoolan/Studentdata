<?php

namespace App\Http\Controllers;

use App\Models\University;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UniversityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $universities = University::orderBy('name')->get();

        return Inertia::render('Pages/Universities', [
            'universities' => $universities
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:universities,name',
        ]);

        University::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'تم إضافة الجامعة بنجاح');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, University $university)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:universities,name,' . $university->id,
        ]);

        $university->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'تم تحديث الجامعة بنجاح');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(University $university)
    {
        $university->delete();
        return back()->with('success', 'تم حذف الجامعة بنجاح');
    }
}
