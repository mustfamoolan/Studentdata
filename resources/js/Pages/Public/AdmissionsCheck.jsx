import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdmissionsCheck({ application = null, flash = null }) {
    const { data, setData, post, processing, errors } = useForm({
        application_number: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admissions/check');
    };

    const downloadStudentPDF = () => {
        if (application && application.status === 'approved' && application.student_id) {
            window.open(`/student/${application.student_id}/pdf`, '_blank');
        }
    };

    const downloadApplicationPDF = () => {
        if (application) {
            window.open(`/application/${application.application_number}/pdf`, '_blank');
        }
    };

    return (
        <>
            <Head title="الاستعلام عن القبولات" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-8">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <div className="bg-white rounded-full p-3">
                                    <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">الاستعلام عن القبولات</h1>
                            <p className="text-blue-100">أدخل رقم طلبك للاستعلام عن حالة القبول</p>
                        </div>
                    </div>
                </div>

                {/* Search Form */}
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <div className="bg-white border-2 border-gray-300 shadow-lg">
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                            <h3 className="text-xl font-bold text-gray-800">بحث عن طلب</h3>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        رقم الطلب *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.application_number}
                                        onChange={(e) => setData('application_number', e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-lg text-center font-mono"
                                        placeholder="مثال: APP-2025-001234"
                                        required
                                    />
                                    {errors.application_number && (
                                        <div className="text-red-600 text-sm mt-1">{errors.application_number}</div>
                                    )}
                                </div>

                                <div className="text-center">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-8 py-3 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-bold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? 'جاري البحث...' : 'البحث عن الطلب'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {flash?.error && (
                    <div className="max-w-4xl mx-auto px-6 mb-6">
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Application Results */}
                {application && (
                    <div className="max-w-4xl mx-auto px-6 pb-8">
                        <div className="bg-white border-2 border-gray-300 shadow-lg">
                            <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                                <h3 className="text-xl font-bold text-gray-800">نتائج البحث</h3>
                            </div>

                            <div className="p-6">
                                {/* حالة الطلب */}
                                <div className="text-center mb-8">
                                    <div className={`inline-block px-6 py-3 rounded-lg text-lg font-bold mb-4 ${
                                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' :
                                        application.status === 'approved' ? 'bg-green-100 text-green-800 border-2 border-green-300' :
                                        'bg-red-100 text-red-800 border-2 border-red-300'
                                    }`}>
                                        {application.status === 'pending' && '⏳ قيد المراجعة'}
                                        {application.status === 'approved' && '✅ مقبول - مبروك!'}
                                        {application.status === 'rejected' && '❌ مرفوض'}
                                    </div>

                                    {application.status === 'approved' && (
                                        <div className="bg-green-50 border border-green-300 p-4 rounded-lg mb-6">
                                            <p className="text-green-800 font-medium">
                                                🎉 تهانينا! تم قبولك في البرنامج. يمكنك الآن تحميل ملف معلوماتك الكامل كطالب.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* بيانات الطالب */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 border border-gray-300 p-4 rounded">
                                        <h5 className="font-bold text-gray-800 mb-3">البيانات الشخصية</h5>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-medium">رقم الطلب:</span> {application.application_number}</div>
                                            <div><span className="font-medium">الاسم:</span> {application.name}</div>
                                            <div><span className="font-medium">رقم الموبايل:</span> {application.mobile}</div>
                                            <div><span className="font-medium">المعدل:</span> {application.gpa || 'غير محدد'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-300 p-4 rounded">
                                        <h5 className="font-bold text-gray-800 mb-3">البيانات الأكاديمية</h5>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-medium">القسم:</span> {application.department}</div>
                                            <div><span className="font-medium">المرحلة:</span> {application.stage}</div>
                                            <div><span className="font-medium">الجامعة:</span> {application.university?.name}</div>
                                            <div><span className="font-medium">تاريخ التقديم:</span> {new Date(application.created_at).toLocaleDateString('ar-SA')}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* أزرار التحميل */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={downloadApplicationPDF}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        تحميل استمارة الطلب
                                    </button>

                                    {application.status === 'approved' && application.student_id && (
                                        <button
                                            onClick={downloadStudentPDF}
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            تحميل ملف الطالب الكامل
                                        </button>
                                    )}
                                </div>

                                {/* تفاصيل إضافية للطلاب المقبولين */}
                                {application.status === 'approved' && application.student && (
                                    <div className="mt-8 bg-green-50 border border-green-300 p-6 rounded-lg">
                                        <h5 className="font-bold text-green-800 mb-4">معلومات إضافية كطالب مقبول</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div><span className="font-medium">رقم الطالب:</span> {application.student?.student_number}</div>
                                            <div><span className="font-medium">المنحة:</span> {application.student?.scholarship || 'غير محدد'}</div>
                                            <div><span className="font-medium">الرسوم المدفوعة:</span> {application.student?.fees_paid || 0} دينار</div>
                                            <div><span className="font-medium">الرسوم المتبقية:</span> {application.student?.fees_remaining || 0} دينار</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="max-w-4xl mx-auto px-6 pb-8">
                    <div className="bg-white border border-gray-300 p-6 rounded-lg shadow">
                        <h4 className="font-bold text-gray-800 mb-4 text-center">روابط سريعة</h4>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="/apply"
                                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center transition-colors duration-200"
                            >
                                تقديم طلب جديد
                            </a>
                            <a
                                href="/"
                                className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-center transition-colors duration-200"
                            >
                                الصفحة الرئيسية
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 text-white py-6">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <p className="text-gray-300">
                            © 2025 نظام إدارة الطلاب - جميع الحقوق محفوظة
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
