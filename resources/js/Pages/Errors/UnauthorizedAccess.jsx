import { Head, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function UnauthorizedAccess({ message = "ليس لديك صلاحية للوصول إلى هذه الصفحة" }) {
    return (
        <AppLayout title="غير مسموح">
            <Head title="غير مسموح" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full">
                    <div className="bg-white border-2 border-red-300 shadow-lg p-8 text-center">
                        {/* أيقونة التحذير */}
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* العنوان */}
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">
                            غير مسموح بالوصول
                        </h1>

                        {/* الرسالة */}
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {message}
                        </p>

                        {/* تفاصيل إضافية */}
                        <div className="bg-red-50 border border-red-200 p-4 mb-6 text-right">
                            <p className="text-sm text-red-700">
                                <strong>ملاحظة:</strong> هذه الصفحة متاحة فقط للمشرفين
                            </p>
                        </div>

                        {/* أزرار العمل */}
                        <div className="space-y-3">
                            <button
                                onClick={() => window.history.back()}
                                className="w-full px-6 py-3 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-medium transition-colors duration-200"
                            >
                                العودة للصفحة السابقة
                            </button>

                            <button
                                onClick={() => router.visit('/')}
                                className="w-full px-6 py-3 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                            >
                                الذهاب للصفحة الرئيسية
                            </button>
                        </div>

                        {/* معلومات الاتصال */}
                        <div className="mt-8 pt-6 border-t-2 border-gray-200">
                            <p className="text-sm text-gray-500">
                                في حالة اعتقادك أن هذا خطأ، يرجى التواصل مع المشرف
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
