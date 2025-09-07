<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>بطاقة الطالب</title>
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
            border: 1px solid #059669;
            padding: 10px;
            margin-bottom: 15px;
            background-color: #f0fdf4;
        }
        .header h1 {
            color: #059669;
            font-size: 16px;
            margin: 0 0 5px 0;
            font-weight: bold;
        }
        .header h2 {
            color: #374151;
            font-size: 12px;
            margin: 0;
        }

        .student-id {
            background-color: #059669;
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
        .status-active { background-color: #10b981; }
        .status-inactive { background-color: #6b7280; }
        .status-graduated { background-color: #0284c7; }

        .photo-section {
            border: 1px dashed #d1d5db;
            width: 100px;
            height: 120px;
            margin: 0 auto 15px auto;
            background-color: #f9fafb;
            text-align: center;
            padding: 10px;
        }

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
            background-color: #e6fffa;
            border: 1px solid #14b8a6;
            padding: 8px;
            margin-bottom: 10px;
            text-align: center;
        }

        .documents-list {
            margin-top: 5px;
        }
        .document-item {
            background-color: #f8fafc;
            border: 1px solid #e5e7eb;
            padding: 6px;
            margin-bottom: 4px;
        }

        .qr-code {
            border: 1px solid #d1d5db;
            width: 60px;
            height: 60px;
            margin: 10px auto;
            background-color: #f9fafb;
            text-align: center;
            padding: 15px;
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
        <h1>🎓 نظام إدارة الطلاب</h1>
        <h2>بطاقة الطالب الرسمية</h2>
    </div>

    <div class="student-id">
        رقم الطالب: {{ $student->id }}
    </div>

    <div class="status-container">
        @if($student->status === 'active')
            <span class="status-badge status-active">✅ نشط</span>
        @elseif($student->status === 'graduated')
            <span class="status-badge status-graduated">🎓 متخرج</span>
        @else
            <span class="status-badge status-inactive">⏸️ غير نشط</span>
        @endif
    </div>

    <!-- صورة الطالب -->
    <div class="photo-section">
        @if($student->profile_image)
            <div style="font-size: 10px; color: #6b7280;">📷 صورة الطالب</div>
        @else
            <div style="font-size: 30px; color: #d1d5db; margin-top: 25px;">👤</div>
            <div style="font-size: 9px; color: #9ca3af; margin-top: 8px;">لا توجد صورة</div>
        @endif
    </div>

    <!-- البيانات الشخصية -->
    <div class="section">
        <div class="section-header">البيانات الشخصية</div>
        <div class="section-content">
            <table class="info-table">
                <tr>
                    <td class="info-label">الاسم:</td>
                    <td class="info-value">{{ $student->name }}</td>
                </tr>
                <tr>
                    <td class="info-label">رقم الهاتف:</td>
                    <td class="info-value">{{ $student->phone ?? 'غير محدد' }}</td>
                </tr>
                <tr>
                    <td class="info-label">البريد الإلكتروني:</td>
                    <td class="info-value">{{ $student->email ?? 'غير محدد' }}</td>
                </tr>
                <tr>
                    <td class="info-label">تاريخ الميلاد:</td>
                    <td class="info-value">{{ $student->birth_date ? $student->birth_date->format('Y/m/d') : 'غير محدد' }}</td>
                </tr>
                <tr>
                    <td class="info-label">العنوان:</td>
                    <td class="info-value">{{ $student->address ?? 'غير محدد' }}</td>
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
                    <td class="info-value">{{ $student->department }}</td>
                </tr>
                <tr>
                    <td class="info-label">المرحلة:</td>
                    <td class="info-value">{{ $student->stage }}</td>
                </tr>
                <tr>
                    <td class="info-label">المعدل التراكمي:</td>
                    <td class="info-value">{{ $student->gpa ?? 'غير محدد' }}</td>
                </tr>
                <tr>
                    <td class="info-label">تاريخ التسجيل:</td>
                    <td class="info-value">{{ $student->created_at->format('Y/m/d') }}</td>
                </tr>
            </table>
        </div>
    </div>

    <!-- معلومات الجامعة -->
    <div class="university-section">
        <div style="font-size: 12px; font-weight: bold; color: #115e59;">الجامعة</div>
        <div style="font-weight: bold; font-size: 14px; color: #115e59; margin-top: 5px;">{{ $student->university->name }}</div>
    </div>

    <!-- المعلومات المالية -->
    @if($student->fees_paid !== null || $student->fees_remaining !== null)
    <div class="section">
        <div class="section-header">المعلومات المالية</div>
        <div class="section-content">
            <table class="info-table">
                @if($student->fees_paid !== null)
                <tr>
                    <td class="info-label">الرسوم المدفوعة:</td>
                    <td class="info-value">{{ number_format($student->fees_paid) }} دينار</td>
                </tr>
                @endif
                @if($student->fees_remaining !== null)
                <tr>
                    <td class="info-label">الرسوم المتبقية:</td>
                    <td class="info-value">{{ number_format($student->fees_remaining) }} دينار</td>
                </tr>
                @endif
            </table>
        </div>
    </div>
    @endif

    <!-- المستندات -->
    @if($student->documents && $student->documents->count() > 0)
    <div class="section">
        <div class="section-header">المستندات</div>
        <div class="section-content">
            <div class="documents-list">
                @foreach($student->documents as $document)
                <div class="document-item">
                    📄 {{ $document->document_type }} - {{ $document->file_name }}
                </div>
                @endforeach
            </div>
        </div>
    </div>
    @endif

    <!-- رمز QR للتحقق -->
    <div style="text-align: center;">
        <div class="qr-code">
            <div style="font-size: 9px; color: #6b7280; margin-top: 15px;">QR Code</div>
        </div>
        <div style="font-size: 9px; color: #9ca3af;">للتحقق من صحة البيانات</div>
    </div>

    <div class="footer">
        <strong>مستند رسمي معتمد من نظام إدارة الطلاب</strong><br>
        تاريخ الإصدار: {{ now()->format('Y/m/d H:i') }} | © {{ date('Y') }} جميع الحقوق محفوظة
    </div>
</body>
</html>
