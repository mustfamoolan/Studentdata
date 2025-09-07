import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ApplicationForm({ universities, flash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        department: '',
        stage: 'بكالوريوس',
        university_id: '',
        mobile: '',
        gpa: '',
        agent_name: '', // حقل اسم المعقب الجديد
        profile_image: null, // الصورة الشخصية
        pdf_file: null, // ملف PDF واحد بدلاً من الصور المنفصلة
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/apply', {
            forceFormData: true,
            preserveScroll: false,
            onSuccess: () => {
                // سيتم التوجيه تلقائياً إلى صفحة النجاح من الـ Controller
            },
            onError: (errors) => {
                console.log('Errors:', errors);
            }
        });
    };

    return (
        <>
            <Head title="استمارة طلب التسجيل" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-8">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center">
                            <div className="flex justify-center items-center mb-4">
                                <div className="bg-white rounded-full p-3">
                                    <svg className="w-8 h-8 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">نظام إدارة الطلاب</h1>
                            <h2 className="text-xl font-medium mb-4">استمارة طلب التسجيل</h2>
                            <p className="text-blue-100">يرجى ملء جميع الحقول المطلوبة بدقة</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="max-w-4xl mx-auto px-6 mt-6">
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-white border-2 border-gray-300 shadow-lg">
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                            <h3 className="text-xl font-bold text-gray-800">بيانات الطالب</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* البيانات الشخصية */}
                            <div className="mb-8">
                                <div className="bg-gray-50 border border-gray-300 px-4 py-2 mb-6">
                                    <h4 className="font-bold text-gray-800">البيانات الشخصية</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطالب *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            placeholder="أدخل الاسم الثلاثي أو الرباعي كاملاً"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">مثال: أحمد محمد علي حسن</p>
                                        {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموبايل *</label>
                                        <input
                                            type="text"
                                            value={data.mobile}
                                            onChange={(e) => setData('mobile', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            placeholder="07xxxxxxxxx"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">رقم الهاتف مكون من 11 رقم يبدأ بـ 07</p>
                                        {errors.mobile && <div className="text-red-600 text-sm mt-1">{errors.mobile}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المعدل</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            value={data.gpa}
                                            onChange={(e) => setData('gpa', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            placeholder="من 0 إلى 100"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">المعدل العام في الشهادة السابقة (اختياري)</p>
                                        {errors.gpa && <div className="text-red-600 text-sm mt-1">{errors.gpa}</div>}
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الشخصية *</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setData('profile_image', e.target.files[0])}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        <div className="bg-blue-50 border border-blue-200 p-3 mt-2">
                                            <p className="text-blue-800 text-sm font-medium mb-1">متطلبات الصورة الشخصية:</p>
                                            <ul className="text-blue-700 text-xs space-y-1">
                                                <li>• صورة واضحة وحديثة للوجه</li>
                                                <li>• خلفية بيضاء أو فاتحة اللون</li>
                                                <li>• حجم الصورة لا يزيد عن 2 ميجابايت</li>
                                                <li>• التنسيقات المقبولة: JPG, PNG, JPEG</li>
                                            </ul>
                                        </div>
                                        {errors.profile_image && <div className="text-red-600 text-sm mt-1">{errors.profile_image}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* البيانات الأكاديمية */}
                            <div className="mb-8">
                                <div className="bg-gray-50 border border-gray-300 px-4 py-2 mb-6">
                                    <h4 className="font-bold text-gray-800">البيانات الأكاديمية</h4>
                                </div>

                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                                        <input
                                            type="text"
                                            value={data.department}
                                            onChange={(e) => setData('department', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            placeholder="مثال: هندسة حاسوب، طب، قانون"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">اسم التخصص أو القسم المراد الالتحاق به</p>
                                        {errors.department && <div className="text-red-600 text-sm mt-1">{errors.department}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة *</label>
                                        <select
                                            value={data.stage}
                                            onChange={(e) => setData('stage', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        >
                                            <option value="بكالوريوس">بكالوريوس</option>
                                            <option value="ماجستير">ماجستير</option>
                                            <option value="دكتوراه">دكتوراه</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">المرحلة الدراسية المطلوب التسجيل فيها</p>
                                        {errors.stage && <div className="text-red-600 text-sm mt-1">{errors.stage}</div>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">الجامعة *</label>
                                        <select
                                            value={data.university_id}
                                            onChange={(e) => setData('university_id', e.target.value)}
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
                                        <p className="text-xs text-gray-500 mt-1">اختر الجامعة التي تريد التقديم إليها</p>
                                        {errors.university_id && <div className="text-red-600 text-sm mt-1">{errors.university_id}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* معلومات المعقب */}
                            <div className="mb-8">
                                <div className="bg-gray-50 border border-gray-300 px-4 py-2 mb-6">
                                    <h4 className="font-bold text-gray-800">معلومات المعقب</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المعقب المرسل</label>
                                        <input
                                            type="text"
                                            value={data.agent_name}
                                            onChange={(e) => setData('agent_name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            placeholder="أدخل اسم المعقب الذي ساعدك في التقديم"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">إذا كان هناك معقب ساعدك في تقديم الطلب، أدخل اسمه هنا (اختياري)</p>
                                        {errors.agent_name && <div className="text-red-600 text-sm mt-1">{errors.agent_name}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* المستندات المطلوبة */}
                            <div className="mb-8">
                                <div className="bg-gray-50 border border-gray-300 px-4 py-2 mb-6">
                                    <h4 className="font-bold text-gray-800">المستندات المطلوبة</h4>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ملف PDF يحتوي على جميع المستندات *
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) => setData('pdf_file', e.target.files[0])}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        <div className="bg-yellow-50 border border-yellow-200 p-3 mt-2">
                                            <p className="text-yellow-800 text-sm font-medium mb-2">المستندات المطلوبة في ملف PDF واحد:</p>
                                            <ul className="text-yellow-700 text-xs space-y-1">
                                                <li>• صورة جواز السفر أو البطاقة الشخصية</li>
                                                <li>• الشهادة الأكاديمية السابقة (الثانوية للبكالوريوس)</li>
                                                <li>• كشف الدرجات الأكاديمي</li>
                                                <li>• أي مستندات إضافية مطلوبة حسب التخصص</li>
                                            </ul>
                                            <p className="text-yellow-600 text-xs mt-2 font-medium">
                                                ملاحظة: الصورة الشخصية يتم رفعها منفصلة في الحقل أعلاه
                                            </p>
                                        </div>
                                        <p className="text-gray-600 text-xs mt-2">
                                            الحد الأقصى لحجم الملف: 10 ميجابايت - تنسيق PDF فقط
                                        </p>
                                        {errors.pdf_file && <div className="text-red-600 text-sm mt-1">{errors.pdf_file}</div>}
                                    </div>
                                </div>
                            </div>

                            {/* إرشادات */}
                            <div className="mb-8 bg-blue-50 border border-blue-200 p-4">
                                <h5 className="font-bold text-blue-800 mb-2">إرشادات مهمة:</h5>
                                <ul className="text-blue-700 text-sm space-y-1">
                                    <li>• تأكد من أن جميع البيانات صحيحة قبل الإرسال</li>
                                    <li>• يجب أن يكون ملف PDF واضح وذو جودة عالية</li>
                                    <li>• تأكد من أن الملف يحتوي على جميع المستندات المطلوبة</li>
                                    <li>• سيتم إعطاؤك رقم طلب للاستعلام عن حالة القبول</li>
                                    <li>• سيتم مراجعة طلبك والرد عليك خلال 3-5 أيام عمل</li>
                                </ul>
                            </div>

                            {/* زر الإرسال */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-bold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'جاري الإرسال...' : 'إرسال الطلب'}
                                </button>
                            </div>
                        </form>
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
