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
        Schema::create('student_applications', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الطالب
            $table->string('department'); // القسم
            $table->string('stage'); // المرحلة
            $table->foreignId('university_id')->constrained()->onDelete('cascade'); // الجامعة
            $table->string('mobile'); // رقم الموبايل
            $table->decimal('gpa', 3, 2)->nullable(); // المعدل
            $table->string('profile_image')->nullable(); // الصورة الشخصية
            $table->string('passport_image')->nullable(); // صورة جواز السفر
            $table->string('certificate_image')->nullable(); // صورة الشهادة
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending'); // الحالة
            $table->text('admin_notes')->nullable(); // ملاحظات الإدارة
            $table->timestamp('reviewed_at')->nullable(); // تاريخ المراجعة
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null'); // المراجع
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_applications');
    }
};
