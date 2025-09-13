<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="utf-8">
    <title>خطاب القبول النهائي</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            direction: rtl;
            text-align: right;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }

        .header {
            text-align: center;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .header h1 {
            color: #2563eb;
            font-size: 24px;
            margin: 0;
        }

        .header h2 {
            color: #64748b;
            font-size: 18px;
            margin: 10px 0 0 0;
        }

        .content {
            margin-bottom: 30px;
        }

        .info-section {
            margin-bottom: 25px;
        }

        .info-section h3 {
            color: #2563eb;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 5px;
            margin-bottom: 15px;
            font-size: 16px;
        }

        .info-row {
            display: flex;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px dotted #e2e8f0;
        }

        .info-label {
            font-weight: bold;
            color: #374151;
            width: 30%;
        }

        .info-value {
            color: #1f2937;
            width: 70%;
        }

        .acceptance-image {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            border: 2px dashed #2563eb;
            border-radius: 8px;
            background-color: #f8fafc;
        }

        .acceptance-image img {
            max-width: 100%;
            max-height: 400px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
        }

        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #2563eb;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
            font-size: 14px;
        }

        .status-accepted {
            background-color: #10b981;
        }

        @page {
            margin: 15mm;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>خطاب القبول النهائي</h1>
        <h2>{{ $application->university->name ?? 'الجامعة' }}</h2>
        <div style="margin-top: 15px;">
            <span class="status-badge status-accepted">مقبول نهائياً</span>
        </div>
    </div>

    <div class="content">
        <!-- معلومات الطلب -->
        <div class="info-section">
            <h3>معلومات الطلب</h3>
            <div class="info-row">
                <span class="info-label">رقم الطلب:</span>
                <span class="info-value">{{ $application->application_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ التقديم:</span>
                <span class="info-value">{{ $application->created_at->format('Y-m-d H:i') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ القبول النهائي:</span>
                <span class="info-value">{{ $application->accepted_at ? \Carbon\Carbon::parse($application->accepted_at)->format('Y-m-d H:i') : 'غير محدد' }}</span>
            </div>
            @if($application->accepted_by)
            <div class="info-row">
                <span class="info-label">تم القبول بواسطة:</span>
                <span class="info-value">المسؤول رقم: {{ $application->accepted_by }}</span>
            </div>
            @endif
        </div>

        <!-- معلومات الطالب -->
        <div class="info-section">
            <h3>البيانات الشخصية</h3>
            <div class="info-row">
                <span class="info-label">الاسم الكامل:</span>
                <span class="info-value">{{ $application->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">الرقم الجامعي:</span>
                <span class="info-value">{{ $application->student->code ?? 'غير محدد' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">القسم:</span>
                <span class="info-value">{{ $application->department }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">الجامعة:</span>
                <span class="info-value">{{ $application->university->name ?? 'غير محدد' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">المرحلة الدراسية:</span>
                <span class="info-value">{{ $application->stage }}</span>
            </div>
            @if($application->gpa)
            <div class="info-row">
                <span class="info-label">المعدل التراكمي:</span>
                <span class="info-value">{{ $application->gpa }}</span>
            </div>
            @endif
            <div class="info-row">
                <span class="info-label">رقم الهاتف:</span>
                <span class="info-value">{{ $application->mobile }}</span>
            </div>
            @if($application->student && $application->student->date)
            <div class="info-row">
                <span class="info-label">تاريخ التسجيل:</span>
                <span class="info-value">{{ \Carbon\Carbon::parse($application->student->date)->format('Y-m-d') }}</span>
            </div>
            @endif
        </div>

        <!-- معلومات التطبيق الأكاديمي -->
        <div class="info-section">
            <h3>معلومات التطبيق الأكاديمي</h3>
            <div class="info-row">
                <span class="info-label">رقم الطلب:</span>
                <span class="info-value">{{ $application->application_number }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ التقديم:</span>
                <span class="info-value">{{ $application->created_at->format('Y-m-d H:i') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">تاريخ القبول النهائي:</span>
                <span class="info-value">{{ $application->accepted_at ? \Carbon\Carbon::parse($application->accepted_at)->format('Y-m-d H:i') : 'غير محدد' }}</span>
            </div>
        </div>

        <!-- صورة القبول -->
        @if($application->acceptance_file)
        <div class="info-section">
            <h3>وثيقة القبول</h3>
            <div class="acceptance-image">
                @php
                    $imagePath = storage_path('app/public/' . $application->acceptance_file);
                    $imageData = base64_encode(file_get_contents($imagePath));
                    $imageType = pathinfo($imagePath, PATHINFO_EXTENSION);
                @endphp
                <img src="data:image/{{ $imageType }};base64,{{ $imageData }}" alt="وثيقة القبول">
                <p style="margin-top: 10px; color: #64748b; font-size: 12px;">
                    وثيقة القبول الرسمية - تم الرفع في {{ \Carbon\Carbon::parse($application->accepted_at)->format('Y-m-d') }}
                </p>
            </div>
        </div>
        @endif
    </div>

    <div class="footer">
        <p>تم إنشاء هذا المستند تلقائياً من نظام إدارة القبولات</p>
        <p>تاريخ الإنشاء: {{ now()->format('Y-m-d H:i:s') }}</p>
        <p style="font-size: 10px; color: #999;">تم التحديث: {{ now()->format('Y-m-d H:i:s') }} - نسخة محدثة</p>
    </div>
</body>
</html>
