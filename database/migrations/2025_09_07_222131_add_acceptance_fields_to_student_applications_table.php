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
            $table->string('acceptance_file')->nullable()->after('pdf_file'); // ملف القبول
            $table->timestamp('accepted_at')->nullable()->after('reviewed_at'); // تاريخ القبول النهائي
            $table->unsignedBigInteger('accepted_by')->nullable()->after('accepted_at'); // من قام بالقبول النهائي
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_applications', function (Blueprint $table) {
            $table->dropColumn(['acceptance_file', 'accepted_at', 'accepted_by']);
        });
    }
};
