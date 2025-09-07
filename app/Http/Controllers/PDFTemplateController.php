<?php

namespace App\Http\Controllers;

class PDFTemplateController
{
    /**
     * Generate beautiful HTML content for student PDF
     */
    public static function generateStudentHTML($data)
    {
        $student = $data['student'];
        $statusColor = $data['statusColor'];
        $statusText = $data['statusText'];
        $paymentPercentage = $data['paymentPercentage'];

        $html = '
        <style>
            body {
                font-family: "DejaVu Sans", sans-serif;
                direction: rtl;
                text-align: right;
                background-color: #f8f9fa;
                margin: 0;
                padding: 20px;
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                border: 3px solid #2563eb;
                padding: 25px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 15px;
                box-shadow: 0 8px 20px rgba(0,0,0,0.15);
            }
            .logo {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .ministry {
                font-size: 18px;
                margin: 8px 0;
                font-weight: 600;
            }
            .title {
                font-size: 26px;
                font-weight: bold;
                margin: 30px 0;
                text-align: center;
                color: #2563eb;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 6px 15px rgba(0,0,0,0.1);
                border: 2px solid #e5e7eb;
            }
            .section {
                margin-bottom: 30px;
                border: 2px solid #e5e7eb;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 6px 20px rgba(0,0,0,0.08);
                background: white;
            }
            .section-header {
                background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                color: white;
                padding: 18px;
                font-weight: bold;
                font-size: 20px;
                text-align: center;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
            }
            .content {
                padding: 25px;
            }
            .row {
                margin-bottom: 15px;
                padding: 12px;
                border-bottom: 2px dotted #d1d5db;
                display: flex;
                align-items: center;
                border-radius: 8px;
                transition: background-color 0.2s;
            }
            .row:hover {
                background-color: #f9fafb;
            }
            .label {
                font-weight: bold;
                color: #374151;
                width: 45%;
                background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                padding: 10px 15px;
                border-radius: 8px;
                margin-left: 15px;
                font-size: 16px;
                border: 1px solid #d1d5db;
            }
            .value {
                color: #1f2937;
                flex: 1;
                padding: 10px;
                font-weight: 500;
                font-size: 16px;
            }
            .status-complete {
                color: #059669;
                font-weight: bold;
                font-size: 18px;
                background: #ecfdf5;
                padding: 8px 15px;
                border-radius: 25px;
                border: 2px solid #059669;
            }
            .status-partial {
                color: #d97706;
                font-weight: bold;
                font-size: 18px;
                background: #fffbeb;
                padding: 8px 15px;
                border-radius: 25px;
                border: 2px solid #d97706;
            }
            .status-pending {
                color: #dc2626;
                font-weight: bold;
                font-size: 18px;
                background: #fef2f2;
                padding: 8px 15px;
                border-radius: 25px;
                border: 2px solid #dc2626;
            }
            .financial-section {
                background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
            }
            .financial-header {
                background: linear-gradient(90deg, #059669, #047857);
            }
            .agents-section {
                background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            }
            .agents-header {
                background: linear-gradient(90deg, #d97706, #b45309);
            }
            .documents-section {
                background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            }
            .documents-header {
                background: linear-gradient(90deg, #3b82f6, #1e40af);
            }
            .document-list {
                margin-top: 20px;
            }
            .document-item {
                padding: 15px;
                border: 2px solid #e5e7eb;
                margin-bottom: 12px;
                border-radius: 10px;
                background: linear-gradient(135deg, #f9fafb, #f3f4f6);
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .document-name {
                font-weight: bold;
                color: #1f2937;
                font-size: 16px;
                margin-bottom: 5px;
            }
            .document-details {
                color: #6b7280;
                font-size: 13px;
                margin-top: 8px;
                padding: 8px;
                background: rgba(255,255,255,0.7);
                border-radius: 5px;
            }
            .footer {
                margin-top: 50px;
                text-align: center;
                font-size: 13px;
                color: #6b7280;
                border-top: 3px solid #e5e7eb;
                padding-top: 25px;
                background: linear-gradient(135deg, #f9fafb, #f3f4f6);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .highlight-box {
                background: linear-gradient(135deg, #eff6ff, #dbeafe);
                border: 2px solid #3b82f6;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
            }
            .amount {
                font-family: monospace;
                font-size: 18px;
                font-weight: bold;
            }
            .subsection-title {
                margin: 25px 0 15px 0;
                text-align: center;
                font-weight: bold;
                font-size: 20px;
                color: #1f2937;
                background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #d1d5db;
            }
            .emoji {
                font-size: 1.2em;
                margin-left: 8px;
            }
        </style>

        <div class="header">
            <div class="logo">🇮🇶 جمهورية العراق</div>
            <div class="ministry">🏛️ وزارة التعليم العالي والبحث العلمي</div>
            <div class="ministry">💼 نظام إدارة بيانات الطلاب</div>
            <div style="margin-top: 20px; font-size: 16px;">📄 تقرير شامل ومفصل</div>
        </div>

        <div class="title">📋 ملف الطالب الشامل</div>

        <!-- معلومات شخصية -->
        <div class="section">
            <div class="section-header">👤 البيانات الشخصية</div>
            <div class="content">
                <div class="row">
                    <span class="label"><span class="emoji">👨‍🎓</span>الاسم الكامل</span>
                    <span class="value">' . $student->name . '</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">🆔</span>الرقم الجامعي</span>
                    <span class="value amount">' . $student->code . '</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">📱</span>رقم الهاتف</span>
                    <span class="value amount">' . $student->mobile . '</span>
                </div>
                ' . ($student->date ? '<div class="row"><span class="label"><span class="emoji">📅</span>تاريخ التسجيل</span> <span class="value">' . date('Y/m/d', strtotime($student->date)) . '</span></div>' : '') . '
            </div>
        </div>

        <!-- معلومات أكاديمية -->
        <div class="section">
            <div class="section-header">🎓 البيانات الأكاديمية</div>
            <div class="content">
                <div class="row">
                    <span class="label"><span class="emoji">🏛️</span>الجامعة</span>
                    <span class="value">' . ($student->university->name ?? 'غير محدد') . '</span>
                </div>
                ' . ($student->university && $student->university->location ? '<div class="row"><span class="label"><span class="emoji">📍</span>موقع الجامعة</span> <span class="value">' . $student->university->location . '</span></div>' : '') . '
                <div class="row">
                    <span class="label"><span class="emoji">📚</span>القسم</span>
                    <span class="value">' . $student->department . '</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">🎯</span>المرحلة الدراسية</span>
                    <span class="value">' . $student->stage . '</span>
                </div>
                ' . ($student->gpa ? '<div class="row"><span class="label"><span class="emoji">📊</span>المعدل التراكمي</span> <span class="value amount">' . $student->gpa . '%</span></div>' : '') . '
            </div>
        </div>

        <!-- معلومات مالية -->
        <div class="section financial-section">
            <div class="section-header financial-header">💰 المعلومات المالية</div>
            <div class="content">
                <div class="highlight-box">
                    <div class="row" style="border-bottom: none; margin-bottom: 0; justify-content: center;">
                        <span class="label"><span class="emoji">📈</span>حالة الدفع</span>
                        <span class="status-' . ($statusColor === 'green' ? 'complete' : ($statusColor === 'orange' ? 'partial' : 'pending')) . '">
                            ' . $statusText . ' (' . $paymentPercentage . '%)
                        </span>
                    </div>
                </div>

                <div class="subsection-title">💳 تفاصيل الأقساط</div>
                <div class="row">
                    <span class="label"><span class="emoji">💵</span>القسط الإجمالي</span>
                    <span class="value amount">' . number_format($student->installment_total) . ' د.ع</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">✅</span>المبلغ المستلم</span>
                    <span class="value amount" style="color: #059669;">' . number_format($student->installment_received) . ' د.ع</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">⏳</span>المبلغ المتبقي</span>
                    <span class="value amount" style="color: #dc2626;">' . number_format($student->installment_remaining ?: ($student->installment_total - $student->installment_received)) . ' د.ع</span>
                </div>

                <div class="subsection-title">🏦 تفاصيل الأجور</div>
                <div class="row">
                    <span class="label"><span class="emoji">💰</span>الأجور الإجمالية</span>
                    <span class="value amount">' . number_format($student->fees_total) . ' د.ع</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">✅</span>الأجور المستلمة</span>
                    <span class="value amount" style="color: #059669;">' . number_format($student->fees_received) . ' د.ع</span>
                </div>
                <div class="row">
                    <span class="label"><span class="emoji">⏳</span>الأجور المتبقية</span>
                    <span class="value amount" style="color: #dc2626;">' . number_format($student->fees_remaining ?: ($student->fees_total - $student->fees_received)) . ' د.ع</span>
                </div>
            </div>
        </div>';

        // معلومات المعقبين
        if ($student->sender_agent || $student->receiver_agent) {
            $html .= '
            <div class="section agents-section">
                <div class="section-header agents-header">🤝 معلومات المعقبين</div>
                <div class="content">';

            if ($student->sender_agent) {
                $html .= '
                    <div class="subsection-title">📤 بيانات المعقب المرسل</div>
                    <div class="row">
                        <span class="label"><span class="emoji">👨‍💼</span>اسم المعقب المرسل</span>
                        <span class="value">' . $student->sender_agent . '</span>
                    </div>
                    <div class="row">
                        <span class="label"><span class="emoji">💵</span>أجور المعقب المرسل</span>
                        <span class="value amount">' . number_format($student->sender_agent_fees) . ' د.ع</span>
                    </div>';
            }

            if ($student->receiver_agent) {
                $html .= '
                    <div class="subsection-title">📥 بيانات المعقب المستلم</div>
                    <div class="row">
                        <span class="label"><span class="emoji">👨‍💼</span>اسم المعقب المستلم</span>
                        <span class="value">' . $student->receiver_agent . '</span>
                    </div>
                    <div class="row">
                        <span class="label"><span class="emoji">💵</span>أجور المعقب المستلم</span>
                        <span class="value amount">' . number_format($student->receiver_agent_fees) . ' د.ع</span>
                    </div>';
            }

            $html .= '
                </div>
            </div>';
        }

        // المستندات
        if ($student->documents && count($student->documents) > 0) {
            $html .= '
            <div class="section documents-section">
                <div class="section-header documents-header">📁 المستندات المرفقة (' . count($student->documents) . ' مستند)</div>
                <div class="content">
                    <div class="document-list">';

            foreach ($student->documents as $index => $doc) {
                $html .= '
                        <div class="document-item">
                            <div class="document-name">📄 ' . ($index + 1) . '. ' . $doc->file_name . '</div>
                            <div class="document-details">
                                📊 النوع: ' . $doc->file_type . ' |
                                💾 الحجم: ' . ($doc->file_size ? round($doc->file_size / 1024 / 1024, 2) . ' ميجابايت' : 'غير محدد') . ' |
                                📅 تاريخ الرفع: ' . ($doc->created_at ? date('Y/m/d', strtotime($doc->created_at)) : 'غير محدد') . '
                            </div>
                        </div>';
            }

            $html .= '
                    </div>
                </div>
            </div>';
        }

        $html .= '
        <div class="footer">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">📄 تم إنشاء هذا التقرير في: ' . date('Y/m/d H:i:s') . '</div>
            <div style="margin: 12px 0; font-size: 14px;">🏛️ نظام إدارة الطلاب</div>
            <div style="margin: 8px 0; font-size: 14px;">🇮🇶 وزارة التعليم العالي والبحث العلمي - جمهورية العراق</div>
            <div style="margin-top: 20px; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                🔒 هذا المستند محمي ومُصدق من الوزارة | For official use only<br>
                ⚡ تم إنشاؤه تلقائياً بواسطة نظام إدارة الطلاب
            </div>
        </div>';

        return $html;
    }
}
