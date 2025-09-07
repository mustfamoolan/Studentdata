import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

export default function StudentProfile({ student, universities, flash }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: student.name,
        department: student.department,
        stage: student.stage,
        gpa: student.gpa || '',
        university_id: student.university_id,
        date: student.date ? student.date.split('T')[0] : '',
        mobile: student.mobile,
        code: student.code,
        profile_image: null,
        installment_total: student.installment_total,
        installment_received: student.installment_received,
        installment_remaining: student.installment_remaining,
        fees_total: student.fees_total,
        fees_received: student.fees_received,
        fees_remaining: student.fees_remaining,
        sender_agent: student.sender_agent || '',
        sender_agent_fees: student.sender_agent_fees,
        receiver_agent: student.receiver_agent || '',
        receiver_agent_fees: student.receiver_agent_fees,
        documents: []
    });

    const handleUpdate = (e) => {
        e.preventDefault();

        // إذا لم تكن هناك ملفات جديدة، استخدم طريقة أسرع
        if (!editData.profile_image && (!editData.documents || editData.documents.length === 0)) {
            // إرسال البيانات النصية فقط (أسرع)
            const dataToSend = { ...editData };
            delete dataToSend.profile_image;
            delete dataToSend.documents;

            put(`/admin/students/${student.id}`, dataToSend, {
                onSuccess: () => {
                    setShowEditModal(false);
                }
            });
        } else {
            // استخدام FormData فقط عند وجود ملفات
            const formData = new FormData();

            Object.keys(editData).forEach(key => {
                if (key === 'documents' && editData[key]?.length > 0) {
                    editData[key].forEach((file, index) => {
                        formData.append(`documents[${index}]`, file);
                    });
                } else if (key === 'profile_image' && editData[key]) {
                    formData.append('profile_image', editData[key]);
                } else if (key !== 'documents' && key !== 'profile_image') {
                    formData.append(key, editData[key] || '');
                }
            });

            formData.append('_method', 'PUT');

            router.post(`/admin/students/${student.id}`, formData, {
                onSuccess: () => {
                    setShowEditModal(false);
                }
            });
        }
    };

    const handleDelete = () => {
        router.delete(`/admin/students/${student.id}`, {
            onSuccess: () => {
                router.visit('/admin/students');
            }
        });
    };

    const generateStudentPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const response = await fetch(`/admin/students/${student.id}/pdf-export`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                return blob;
            } else {
                throw new Error('فشل في إنشاء ملف PDF');
            }
        } catch (error) {
            alert('حدث خطأ في إنشاء ملف PDF: ' + error.message);
            return null;
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    const handleShareWhatsApp = async () => {
        const pdfBlob = await generateStudentPDF();
        if (!pdfBlob) return;

        // تحضير النص
        const text = `📋 *بيانات الطالب*

👤 *الاسم:* ${student.name}
🆔 *الرقم الجامعي:* ${student.code}
🏫 *الجامعة:* ${student.university?.name || 'غير محدد'}
📚 *القسم:* ${student.department}
🎓 *المرحلة:* ${student.stage}
📱 *رقم الهاتف:* ${student.mobile}
${student.gpa ? `📊 *المعدل:* ${student.gpa}` : ''}

💰 *المعلومات المالية:*
• القسط: ${student.installment_total?.toLocaleString() || 0} د.ع
• واصل القسط: ${student.installment_received?.toLocaleString() || 0} د.ع
• باقي القسط: ${(student.installment_remaining || (student.installment_total - student.installment_received))?.toLocaleString() || 0} د.ع

• الأجور: ${student.fees_total?.toLocaleString() || 0} د.ع
• واصل الأجور: ${student.fees_received?.toLocaleString() || 0} د.ع
• باقي الأجور: ${(student.fees_remaining || (student.fees_total - student.fees_received))?.toLocaleString() || 0} د.ع

${student.sender_agent ? `🔗 *المعقب المرسل:* ${student.sender_agent} (${student.sender_agent_fees?.toLocaleString() || 0} د.ع)` : ''}
${student.receiver_agent ? `🔗 *المعقب المستلم:* ${student.receiver_agent} (${student.receiver_agent_fees?.toLocaleString() || 0} د.ع)` : ''}

📄 *ملف PDF مرفق مع جميع التفاصيل والمستندات*

🏛️ *وزارة التعليم العالي والبحث العلمي*`;

        // إنشاء رابط WhatsApp
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

        // فتح WhatsApp في نافذة جديدة
        window.open(whatsappUrl, '_blank');

        // تحميل ملف PDF للمستخدم
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_${student.code}_${student.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleShareTelegram = async () => {
        const pdfBlob = await generateStudentPDF();
        if (!pdfBlob) return;

        // تحضير النص
        const text = `📋 **بيانات الطالب**

👤 **الاسم:** ${student.name}
🆔 **الرقم الجامعي:** ${student.code}
🏫 **الجامعة:** ${student.university?.name || 'غير محدد'}
📚 **القسم:** ${student.department}
🎓 **المرحلة:** ${student.stage}
📱 **رقم الهاتف:** ${student.mobile}
${student.gpa ? `📊 **المعدل:** ${student.gpa}` : ''}

💰 **المعلومات المالية:**
• القسط: ${student.installment_total?.toLocaleString() || 0} د.ع
• واصل القسط: ${student.installment_received?.toLocaleString() || 0} د.ع
• باقي القسط: ${(student.installment_remaining || (student.installment_total - student.installment_received))?.toLocaleString() || 0} د.ع

• الأجور: ${student.fees_total?.toLocaleString() || 0} د.ع
• واصل الأجور: ${student.fees_received?.toLocaleString() || 0} د.ع
• باقي الأجور: ${(student.fees_remaining || (student.fees_total - student.fees_received))?.toLocaleString() || 0} د.ع

${student.sender_agent ? `🔗 **المعقب المرسل:** ${student.sender_agent} (${student.sender_agent_fees?.toLocaleString() || 0} د.ع)` : ''}
${student.receiver_agent ? `🔗 **المعقب المستلم:** ${student.receiver_agent} (${student.receiver_agent_fees?.toLocaleString() || 0} د.ع)` : ''}

📄 **ملف PDF مرفق مع جميع التفاصيل والمستندات**

🏛️ **وزارة التعليم العالي والبحث العلمي**`;

        // إنشاء رابط Telegram
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent('')}&text=${encodeURIComponent(text)}`;

        // فتح Telegram في نافذة جديدة
        window.open(telegramUrl, '_blank');

        // تحميل ملف PDF للمستخدم
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `student_${student.code}_${student.name}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const paymentPercentage = student.installment_total > 0
        ? Math.round((student.installment_received / student.installment_total) * 100)
        : 0;

    let statusColor = 'text-red-600';
    let statusText = 'معلق';
    if (paymentPercentage >= 100) {
        statusColor = 'text-green-600';
        statusText = 'مكتمل';
    } else if (paymentPercentage >= 50) {
        statusColor = 'text-yellow-600';
        statusText = 'جزئي';
    }

    return (
        <AppLayout>
            <Head title={`ملف الطالب - ${student.name}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header Bar */}
                <div className="bg-white border-b-2 border-gray-400">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/admin/students"
                                    className="text-blue-600 hover:text-blue-800 text-sm border border-blue-600 px-3 py-1 hover:bg-blue-50"
                                >
                                    ← العودة للقائمة
                                </Link>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">ملف الطالب</h1>
                                    <p className="text-sm text-gray-600 mt-1">وزارة التعليم العالي والبحث العلمي</p>
                                </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => handleShareWhatsApp()}
                                    disabled={isGeneratingPDF}
                                    className="px-3 py-2 bg-green-600 text-white text-sm border border-green-600 hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isGeneratingPDF ? (
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                    )}
                                    {isGeneratingPDF ? 'جاري الإنشاء...' : 'إرسال واتساب'}
                                </button>
                                <button
                                    onClick={() => handleShareTelegram()}
                                    disabled={isGeneratingPDF}
                                    className="px-3 py-2 bg-blue-500 text-white text-sm border border-blue-500 hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isGeneratingPDF ? (
                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                                        </svg>
                                    )}
                                    {isGeneratingPDF ? 'جاري الإنشاء...' : 'إرسال تلجرام'}
                                </button>
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm border border-blue-600 hover:bg-blue-700"
                                >
                                    تعديل البيانات
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 py-2 bg-red-600 text-white text-sm border border-red-600 hover:bg-red-700"
                                >
                                    حذف الطالب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Info */}
                <div className="px-6 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Personal Info Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-400">
                                <div className="bg-gray-100 border-b border-gray-400 px-4 py-2">
                                    <h2 className="text-lg font-semibold text-gray-900">البيانات الشخصية</h2>
                                </div>
                                <div className="p-4">
                                    <table className="w-full border border-gray-400">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">
                                                    الاسم الكامل
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                    {student.name}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    الرقم الجامعي
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                    {student.code}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    القسم
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                    {student.department}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    الجامعة
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                    {student.university?.name}
                                                    {student.university?.location && (
                                                        <div className="text-sm text-gray-500">{student.university.location}</div>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    المرحلة الدراسية
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                    {student.stage}
                                                </td>
                                            </tr>
                                            {student.gpa && (
                                                <tr>
                                                    <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                        المعدل التراكمي
                                                    </td>
                                                    <td className="border border-gray-400 px-3 py-2 text-gray-900 font-bold">
                                                        {student.gpa}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    رقم الهاتف
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                    {student.mobile}
                                                </td>
                                            </tr>
                                            {student.date && (
                                                <tr>
                                                    <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                        تاريخ التسجيل
                                                    </td>
                                                    <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                        {new Date(student.date).toLocaleDateString('ar-EG')}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Financial Info */}
                            <div className="bg-white border border-gray-400 mt-6">
                                <div className="bg-gray-100 border-b border-gray-400 px-4 py-2">
                                    <h2 className="text-lg font-semibold text-gray-900">المعلومات المالية</h2>
                                </div>
                                <div className="p-4">
                                    <table className="w-full border border-gray-400">
                                        <tbody>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700 w-1/3">
                                                    حالة الدفع
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2">
                                                    <span className={`${statusColor} font-bold`}>
                                                        {statusText} ({paymentPercentage}%)
                                                    </span>
                                                </td>
                                            </tr>

                                            {/* قسم الأقساط */}
                                            <tr>
                                                <td colSpan="2" className="border border-gray-400 px-3 py-2 bg-blue-50 font-bold text-blue-800 text-center">
                                                    الأقساط
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    القسط
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                    {student.installment_total?.toLocaleString()} د.ع
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    واصل القسط
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-green-600 font-mono font-bold">
                                                    {student.installment_received?.toLocaleString()} د.ع
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    باقي القسط
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-red-600 font-mono font-bold">
                                                    {student.installment_remaining?.toLocaleString() || (student.installment_total - student.installment_received)?.toLocaleString()} د.ع
                                                </td>
                                            </tr>

                                            {/* قسم الأجور */}
                                            <tr>
                                                <td colSpan="2" className="border border-gray-400 px-3 py-2 bg-green-50 font-bold text-green-800 text-center">
                                                    الأجور
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    الأجور
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                    {student.fees_total?.toLocaleString()} د.ع
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    واصل الأجور
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-green-600 font-mono font-bold">
                                                    {student.fees_received?.toLocaleString()} د.ع
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                    باقي الأجور
                                                </td>
                                                <td className="border border-gray-400 px-3 py-2 text-red-600 font-mono font-bold">
                                                    {student.fees_remaining?.toLocaleString() || (student.fees_total - student.fees_received)?.toLocaleString()} د.ع
                                                </td>
                                            </tr>

                                            {/* قسم المعقبين */}
                                            {(student.sender_agent || student.receiver_agent) && (
                                                <>
                                                    <tr>
                                                        <td colSpan="2" className="border border-gray-400 px-3 py-2 bg-yellow-50 font-bold text-yellow-800 text-center">
                                                            المعقبين
                                                        </td>
                                                    </tr>
                                                    {student.sender_agent && (
                                                        <>
                                                            <tr>
                                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                                    المعقب المرسل
                                                                </td>
                                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                                    {student.sender_agent}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                                    أجور المعقب المرسل
                                                                </td>
                                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                                    {student.sender_agent_fees?.toLocaleString()} د.ع
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                    {student.receiver_agent && (
                                                        <>
                                                            <tr>
                                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                                    المعقب المستلم
                                                                </td>
                                                                <td className="border border-gray-400 px-3 py-2 text-gray-900">
                                                                    {student.receiver_agent}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className="border border-gray-400 px-3 py-2 bg-gray-50 font-medium text-gray-700">
                                                                    أجور المعقب المستلم
                                                                </td>
                                                                <td className="border border-gray-400 px-3 py-2 text-gray-900 font-mono">
                                                                    {student.receiver_agent_fees?.toLocaleString()} د.ع
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Profile Image and Status */}
                        <div>
                            <div className="bg-white border border-gray-400">
                                <div className="bg-gray-100 border-b border-gray-400 px-4 py-2">
                                    <h2 className="text-lg font-semibold text-gray-900">الصورة الشخصية</h2>
                                </div>
                                <div className="p-4 text-center">
                                    {student.profile_image ? (
                                        <img
                                            className="w-32 h-32 border-2 border-gray-300 mx-auto mb-4 rounded-lg object-cover shadow-sm"
                                            src={`/storage/${student.profile_image}`}
                                            alt={student.name}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-32 h-32 border-2 border-gray-300 bg-gray-100 mx-auto mb-4 flex items-center justify-center rounded-lg">
                                            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    )}

                                    <div className={`inline-block px-3 py-1 border ${statusColor === 'text-green-600' ? 'border-green-600 bg-green-50' : statusColor === 'text-yellow-600' ? 'border-yellow-600 bg-yellow-50' : 'border-red-600 bg-red-50'} text-sm font-medium`}>
                                        {statusText}
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            {student.documents && student.documents.length > 0 && (
                                <div className="bg-white border border-gray-400 mt-6">
                                    <div className="bg-gray-100 border-b border-gray-400 px-4 py-2">
                                        <h2 className="text-lg font-semibold text-gray-900">المستندات ({student.documents.length})</h2>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2">
                                            {student.documents.map((doc, index) => (
                                                <div key={index} className="flex items-center justify-between border border-gray-300 p-3 bg-gray-50">
                                                    <div className="flex items-center space-x-3 space-x-reverse">
                                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <div>
                                                            <span className="text-sm font-medium text-gray-700">{doc.file_name}</span>
                                                            <div className="text-xs text-gray-500">
                                                                {doc.file_size && `${(doc.file_size / 1024 / 1024).toFixed(2)} ميجابايت`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2 space-x-reverse">
                                                        <a
                                                            href={`/admin/students/documents/${doc.id}/download`}
                                                            className="px-3 py-1 bg-blue-600 text-white text-xs hover:bg-blue-700 transition-colors duration-200"
                                                        >
                                                            تحميل
                                                        </a>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('هل تريد حذف هذا المستند؟')) {
                                                                    router.delete(`/admin/students/documents/${doc.id}`);
                                                                }
                                                            }}
                                                            className="px-3 py-1 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors duration-200"
                                                        >
                                                            حذف
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white border-2 border-gray-400 w-full max-w-4xl max-h-screen overflow-y-auto m-4">
                        <div className="bg-gray-100 border-b border-gray-400 px-6 py-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">تعديل بيانات الطالب</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-600 hover:text-gray-800 text-xl font-bold"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6">
                            {/* البيانات الشخصية */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">البيانات الشخصية</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطالب *</label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData('name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                                        <input
                                            type="text"
                                            value={editData.mobile}
                                            onChange={(e) => setEditData('mobile', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                        <input
                                            type="date"
                                            value={editData.date}
                                            onChange={(e) => setEditData('date', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* البيانات الأكاديمية */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">البيانات الأكاديمية</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الكود *</label>
                                        <input
                                            type="text"
                                            value={editData.code}
                                            onChange={(e) => setEditData('code', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                                        <input
                                            type="text"
                                            value={editData.department}
                                            onChange={(e) => setEditData('department', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة</label>
                                        <select
                                            value={editData.stage}
                                            onChange={(e) => setEditData('stage', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        >
                                            <option value="بكالوريوس">بكالوريوس</option>
                                            <option value="ماجستير">ماجستير</option>
                                            <option value="دكتوراه">دكتوراه</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الجامعة *</label>
                                        <select
                                            value={editData.university_id}
                                            onChange={(e) => setEditData('university_id', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        >
                                            <option value="">اختر الجامعة</option>
                                            {universities.map(university => (
                                                <option key={university.id} value={university.id}>
                                                    {university.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المعدل</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={editData.gpa}
                                            onChange={(e) => setEditData('gpa', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* الأقساط */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">القسط</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">القسط</label>
                                        <input
                                            type="number"
                                            value={editData.installment_total}
                                            onChange={(e) => setEditData('installment_total', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">واصل القسط</label>
                                        <input
                                            type="number"
                                            value={editData.installment_received}
                                            onChange={(e) => setEditData('installment_received', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">باقي القسط</label>
                                        <input
                                            type="number"
                                            value={editData.installment_remaining}
                                            onChange={(e) => setEditData('installment_remaining', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* الأجور */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">الأجور</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الأجور</label>
                                        <input
                                            type="number"
                                            value={editData.fees_total}
                                            onChange={(e) => setEditData('fees_total', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">واصل الأجور</label>
                                        <input
                                            type="number"
                                            value={editData.fees_received}
                                            onChange={(e) => setEditData('fees_received', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">باقي الأجور</label>
                                        <input
                                            type="number"
                                            value={editData.fees_remaining}
                                            onChange={(e) => setEditData('fees_remaining', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* المعقبين */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">بيانات المعقبين</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المرسل</label>
                                        <input
                                            type="text"
                                            value={editData.sender_agent}
                                            onChange={(e) => setEditData('sender_agent', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الأجور التي تخص المعقب المرسل</label>
                                        <input
                                            type="number"
                                            value={editData.sender_agent_fees}
                                            onChange={(e) => setEditData('sender_agent_fees', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المستلم</label>
                                        <input
                                            type="text"
                                            value={editData.receiver_agent}
                                            onChange={(e) => setEditData('receiver_agent', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الأجور التي تخص المعقب المستلم</label>
                                        <input
                                            type="number"
                                            value={editData.receiver_agent_fees}
                                            onChange={(e) => setEditData('receiver_agent_fees', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* الملفات */}
                            <div className="mb-6">
                                <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                    <h4 className="font-bold text-gray-800">الملفات</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">تحديث الصورة الشخصية</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setEditData('profile_image', e.target.files[0])}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">إضافة مستندات جديدة</label>
                                        <input
                                            type="file"
                                            multiple
                                            onChange={(e) => setEditData('documents', Array.from(e.target.files))}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t-2 border-gray-300 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-6 py-2 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editProcessing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white border-2 border-gray-400 w-full max-w-md m-4">
                        <div className="bg-gray-100 border-b border-gray-400 px-6 py-3">
                            <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                هل أنت متأكد من رغبتك في حذف الطالب <strong>{student.name}</strong>؟
                            </p>
                            <p className="text-red-600 text-sm mb-6">
                                تحذير: هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع البيانات والمستندات المرتبطة بالطالب.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white border border-red-600 hover:bg-red-700"
                                >
                                    حذف الطالب
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Flash Messages */}
            {flash?.success && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 z-50">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 z-50">
                    {flash.error}
                </div>
            )}
        </AppLayout>
    );
}
