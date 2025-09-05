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
        Schema::create('student_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade');
            $table->string('file_name'); // اسم الملف الأصلي
            $table->string('file_path'); // مسار الملف المحفوظ
            $table->string('file_type'); // نوع الملف (image, document, etc.)
            $table->string('mime_type'); // نوع MIME
            $table->bigInteger('file_size'); // حجم الملف بالبايت
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_documents');
    }
};
