import { Head } from '@inertiajs/react';

export default function ApplicationSuccess({ application }) {
    const downloadPDF = () => {
        window.open(`/application/${application.application_number}/pdf`, '_blank');
    };

    return (
        <>
            <Head title="تم إرسال الطلب بنجاح" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="flex justify-center items-center mb-4">
                            <div className="bg-white rounded-full p-4">
                                <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">تم إرسال طلبك بنجاح!</h1>
                        <p className="text-green-100 text-lg">شكراً لك على تقديم طلب التسجيل</p>
                    </div>
                </div>

                {/* Success Content */}
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white border-2 border-green-300 shadow-lg rounded-lg overflow-hidden">
                        <div className="bg-green-100 border-b-2 border-green-300 px-6 py-4">
                            <h3 className="text-xl font-bold text-green-800">معلومات الطلب</h3>
                        </div>

                        <div className="p-8">
                            {/* رقم الطلب */}
                            <div className="text-center mb-8">
                                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
                                    <h4 className="text-lg font-bold text-green-800 mb-2">رقم طلبك</h4>
                                    <div className="text-3xl font-bold text-green-600 mb-4">
                                        {application.application_number}
                                    </div>
                                    <p className="text-green-700 text-sm">
                                        احتفظ بهذا الرقم للاستعلام عن حالة طلبك
                                    </p>
                                </div>
                            </div>

                            {/* بيانات الطالب */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 border border-gray-300 p-4 rounded">
                                    <h5 className="font-bold text-gray-800 mb-3">البيانات الشخصية</h5>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">الاسم:</span> {application.name}</div>
                                        <div><span className="font-medium">رقم الموبايل:</span> {application.mobile}</div>
                                        <div><span className="font-medium">المعدل:</span> {application.gpa || 'غير محدد'}</div>
                                        {application.agent_name && (
                                            <div><span className="font-medium">اسم المعقب:</span> {application.agent_name}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-300 p-4 rounded">
                                    <h5 className="font-bold text-gray-800 mb-3">البيانات الأكاديمية</h5>
                                    <div className="space-y-2 text-sm">
                                        <div><span className="font-medium">القسم:</span> {application.department}</div>
                                        <div><span className="font-medium">المرحلة:</span> {application.stage}</div>
                                        <div><span className="font-medium">الجامعة:</span> {application.university?.name}</div>
                                    </div>
                                </div>
                            </div>

                            {/* معلومات إضافية */}
                            <div className="bg-blue-50 border border-blue-300 p-4 rounded mb-8">
                                <h5 className="font-bold text-blue-800 mb-2">ملاحظة هامة</h5>
                                <div className="flex items-center">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                        ⏳ طلبك قيد المراجعة الآن
                                    </span>
                                </div>
                                <p className="text-blue-700 text-sm mt-2">
                                    سيتم إشعارك بنتيجة المراجعة خلال 3-5 أيام عمل
                                </p>
                            </div>

                            {/* أزرار العمل */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={downloadPDF}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    تحميل استمارة الطلب
                                </button>

                                <a
                                    href="/admissions"
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors duration-200 text-center"
                                >
                                    استعلام عن حالة القبول
                                </a>

                                <a
                                    href="/apply"
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors duration-200 text-center"
                                >
                                    تقديم طلب جديد
                                </a>
                            </div>

                            {/* معلومات إضافية */}
                            <div className="mt-8 bg-yellow-50 border border-yellow-300 p-4 rounded">
                                <h5 className="font-bold text-yellow-800 mb-2">معلومات مهمة:</h5>
                                <ul className="text-yellow-700 text-sm space-y-1">
                                    <li>• سيتم مراجعة طلبك خلال 3-5 أيام عمل</li>
                                    <li>• يمكنك الاستعلام عن حالة طلبك باستخدام الرقم المذكور أعلاه</li>
                                    <li>• في حالة القبول، ستحصل على ملف PDF كامل بمعلوماتك كطالب</li>
                                    <li>• تأكد من الاحتفاظ برقم الطلب في مكان آمن</li>
                                </ul>
                            </div>
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
