<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->decimal('gpa', 5, 2)->nullable()->change(); // يدعم أرقام مثل 100.00
        });

        Schema::table('student_applications', function (Blueprint $table) {
            $table->decimal('gpa', 5, 2)->nullable()->change(); // يدعم أرقام مثل 100.00
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->decimal('gpa', 3, 2)->nullable()->change(); // العودة للحالة السابقة
        });

        Schema::table('student_applications', function (Blueprint $table) {
            $table->decimal('gpa', 3, 2)->nullable()->change(); // العودة للحالة السابقة
        });
    }
};
