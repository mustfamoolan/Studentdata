<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>استمارة طلب التسجيل</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #333;
            direction: rtl;
            text-align: right;
            margin: 15px;
        }

        .header {
            text-align: center;
            border: 1px solid #1e40af;
            padding: 10px;
            margin-bottom: 15px;
            background-color: #f8fafc;
        }
        .header h1 {
            color: #1e40af;
            font-size: 16px;
            margin: 0 0 5px 0;
            font-weight: bold;
        }
        .header h2 {
            color: #374151;
            font-size: 12px;
            margin: 0;
        }

        .app-number {
            background-color: #1e40af;
            color: white;
            padding: 8px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .status-container {
            text-align: center;
            margin-bottom: 10px;
        }
        .status-badge {
            padding: 6px 15px;
            font-weight: bold;
            color: white;
            font-size: 10px;
        }
        .status-pending { background-color: #f59e0b; }
        .status-approved { background-color: #10b981; }
        .status-rejected { background-color: #ef4444; }

        .section {
            border: 1px solid #d1d5db;
            margin-bottom: 10px;
            background-color: white;
        }
        .section-header {
            background-color: #f3f4f6;
            padding: 6px 10px;
            font-weight: bold;
            font-size: 11px;
            color: #374151;
            border-bottom: 1px solid #d1d5db;
        }
        .section-content {
            padding: 8px;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 5px;
        }
        .info-table td {
            padding: 4px;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-label {
            font-weight: bold;
            color: #6b7280;
            width: 120px;
        }
        .info-value {
            color: #1f2937;
        }

        .university-section {
            background-color: #e0f2fe;
            border: 1px solid #0284c7;
            padding: 8px;
            margin-bottom: 10px;
            text-align: center;
        }

        .signature-section {
            margin-top: 15px;
            border: 1px dashed #9ca3af;
            padding: 15px;
        }

        .signature-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-table td {
            width: 33%;
            text-align: center;
            padding: 10px;
            border: 1px solid #d1d5db;
        }

        .footer {
            margin-top: 15px;
            padding: 8px;
            border-top: 1px solid #d1d5db;
            background-color: #f9fafb;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏛️ نظام إدارة الطلاب</h1>
        <h2>استمارة طلب التسجيل الرسمية</h2>
    </div>

    <div class="app-number">
        رقم الطلب: {{ $application->application_number }}
    </div>

    <div class="status-container">
        @if($application->status === 'pending')
            <span class="status-badge status-pending">⏳ قيد المراجعة</span>
        @elseif($application->status === 'approved')
            <span class="status-badge status-approved">✅ مقبول</span>
        @else
            <span class="status-badge status-rejected">❌ مرفوض</span>
        @endif
    </div>

    <!-- البيانات الشخصية -->
    <div class="section">
        <div class="section-header">البيانات الشخصية</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">الاسم:</td>
                    <td class="info-value">{{ $application->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">الموبايل:</td>
                    <td class="info-value">{{ $application->mobile }}</td>
                </tr>
                <tr>
                    <td class="info-label">المعدل:</td>
                    <td class="info-value">{{ $application->gpa ?? 'غير محدد' }}</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- البيانات الأكاديمية -->
    <div class="section">
        <div class="section-header">البيانات الأكاديمية</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">القسم:</td>
                    <td class="info-value">{{ $application->department }}</td>
                </tr>
                <tr>
                    <td class="info-label">المرحلة:</td>
                    <td class="info-value">{{ $application->stage }}</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- معلومات الجامعة -->
    <div class="university-section">
        <div style="font-size: 12px; font-weight: bold; color: #0c4a6e;">الجامعة</div>
        <div style="font-weight: bold; font-size: 14px; color: #0c4a6e; margin-top: 5px;">{{ $application->university->name }}</div>
    </div>

    <!-- معلومات الطلب -->
    <div class="section">
        <div class="section-header">تفاصيل الطلب</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">تاريخ التقديم:</td>
                    <td class="info-value">{{ $application->created_at->format('Y/m/d') }}</td>
                </tr>
                @if($application->agent_name)
                <tr>
                    <td class="info-label">اسم المعقب:</td>
                    <td class="info-value">{{ $application->agent_name }}</td>
                </tr>
                @endif
                @if($application->reviewed_at)
                <tr>
                    <td class="info-label">تاريخ المراجعة:</td>
                    <td class="info-value">{{ $application->reviewed_at->format('Y/m/d') }}</td>
                </tr>
                @endif
                @if($application->admin_notes)
                <tr>
                    <td class="info-label">ملاحظات الإدارة:</td>
                    <td class="info-value">{{ $application->admin_notes }}</td>
                </tr>
                @endif
            </table>
        </div>
    </div>

    <!-- المستندات -->
    @if($application->pdf_file)
    <div class="section">
        <div class="section-header">المستندات المرفقة</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">📎 ملف PDF:</td>
                    <td class="info-value">يحتوي على جميع المستندات المطلوبة</td>
                </tr>
            </table>
        </div>
    </div>
    @endif

    <!-- منطقة التوقيعات -->
    <div class="signature-section">
        <table class="signature-table">
            <tr>
                <td>
                    <div style="font-size: 10px; color: #6b7280; margin-bottom: 20px;">توقيع مقدم الطلب</div>
                    <div style="border-top: 1px solid #6b7280; padding-top: 3px; font-size: 9px;">التوقيع</div>
                </td>
                <td>
                    <div style="font-size: 10px; color: #6b7280; margin-bottom: 20px;">توقيع المراجع</div>
                    <div style="border-top: 1px solid #6b7280; padding-top: 3px; font-size: 9px;">التوقيع</div>
                </td>
                <td>
                    <div style="font-size: 10px; color: #6b7280; margin-bottom: 20px;">ختم الإدارة</div>
                    <div style="border-top: 1px solid #6b7280; padding-top: 3px; font-size: 9px;">الختم</div>
                </td>
            </tr>
        </table>
    </div>

    <div class="footer">
        <strong>مستند رسمي معتمد من نظام إدارة الطلاب</strong><br>
        تاريخ الإصدار: {{ now()->format('Y/m/d H:i') }} | © {{ date('Y') }} جميع الحقوق محفوظة
    </div>
</body>
</html>
