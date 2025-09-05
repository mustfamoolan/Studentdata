import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

export default function StudentProfile({ student, universities, flash }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: student.name,
        department: student.department,
        stage: student.stage,
        gpa: student.gpa || '',
        university_id: student.university_id,
        date: student.date,
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

        const formData = new FormData();
        Object.keys(editData).forEach(key => {
            if (key === 'documents' && editData[key].length > 0) {
                editData[key].forEach((file, index) => {
                    formData.append(`documents[${index}]`, file);
                });
            } else if (key === 'profile_image' && editData[key]) {
                formData.append('profile_image', editData[key]);
            } else {
                formData.append(key, editData[key] || '');
            }
        });

        put(`/admin/students/${student.id}`, {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setShowEditModal(false);
            }
        });
    };

    const handleDelete = () => {
        router.delete(`/admin/students/${student.id}`, {
            onSuccess: () => {
                router.visit('/admin/students');
            }
        });
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
                            <div className="flex gap-2">
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
