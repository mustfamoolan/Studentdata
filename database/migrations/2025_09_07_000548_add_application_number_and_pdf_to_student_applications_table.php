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
        Schema::table('student_applications', function (Blueprint $table) {
            $table->string('application_number')->unique()->nullable();
            $table->string('pdf_file')->nullable(); // ملف PDF واحد
            $table->dropColumn(['profile_image', 'passport_image', 'certificate_image']); // حذف الصور المنفصلة
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_applications', function (Blueprint $table) {
            $table->dropColumn(['application_number', 'pdf_file']);
            $table->string('profile_image')->nullable();
            $table->string('passport_image')->nullable();
            $table->string('certificate_image')->nullable();
        });
    }
};
