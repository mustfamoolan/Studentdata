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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // اسم الطالب
            $table->string('department'); // القسم
            $table->enum('stage', ['بكالوريوس', 'ماجستير', 'دكتوراه']); // المرحلة
            $table->decimal('gpa', 5, 2)->nullable(); // المعدل من 100
            $table->foreignId('university_id')->constrained()->onDelete('cascade'); // الجامعة
            $table->date('date'); // التاريخ
            $table->string('mobile'); // رقم الموبايل
            $table->string('code')->unique(); // الكود

            // القسط
            $table->decimal('installment_total', 10, 2)->default(0); // القسط الكلي
            $table->decimal('installment_received', 10, 2)->default(0); // واصل
            $table->decimal('installment_remaining', 10, 2)->default(0); // باقي

            // الأجور
            $table->decimal('fees_total', 10, 2)->default(0); // الأجور الكلية
            $table->decimal('fees_received', 10, 2)->default(0); // واصل
            $table->decimal('fees_remaining', 10, 2)->default(0); // باقي

            // المعقب المرسل
            $table->string('sender_agent')->nullable(); // المعقب المرسل
            $table->decimal('sender_agent_fees', 10, 2)->default(0); // أجور المعقب المرسل

            // المعقب المستلم
            $table->string('receiver_agent')->nullable(); // المعقب المستلم
            $table->decimal('receiver_agent_fees', 10, 2)->default(0); // أجور المعقب المستلم

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
