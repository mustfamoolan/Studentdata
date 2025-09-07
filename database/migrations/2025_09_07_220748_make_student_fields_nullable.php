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
            // جعل الحقول الأساسية nullable
            $table->string('name')->nullable()->change();
            $table->string('department')->nullable()->change();
            $table->enum('stage', ['بكالوريوس', 'ماجستير', 'دكتوراه'])->nullable()->change();
            $table->foreignId('university_id')->nullable()->change();
            $table->date('date')->nullable()->change();
            $table->string('mobile')->nullable()->change();
            $table->string('code')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // إرجاع الحقول إلى required
            $table->string('name')->nullable(false)->change();
            $table->string('department')->nullable(false)->change();
            $table->enum('stage', ['بكالوريوس', 'ماجستير', 'دكتوراه'])->nullable(false)->change();
            $table->foreignId('university_id')->nullable(false)->change();
            $table->date('date')->nullable(false)->change();
            $table->string('mobile')->nullable(false)->change();
            $table->string('code')->nullable(false)->change();
        });
    }
};
