import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

export default function Acceptances({ applications = [], flash, user }) {
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // نموذج القبول النهائي
    const { data: acceptData, setData: setAcceptData, post: acceptStudent, processing: acceptProcessing, errors: acceptErrors, reset: resetAccept } = useForm({
        acceptance_file: null,
    });

    // تصفية الطلبات - إظهار الطلبات المعتمدة فقط (approved)
    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.mobile.includes(searchTerm) ||
                             app.department.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const handleAccept = (application) => {
        setSelectedApplication(application);
        resetAccept();
        setShowAcceptModal(true);
    };

    const submitAccept = (e) => {
        e.preventDefault();
        acceptStudent(`/admin/applications/${selectedApplication.id}/accept`, {
            forceFormData: true,
            onSuccess: () => {
                setShowAcceptModal(false);
                setSelectedApplication(null);
                resetAccept();
            }
        });
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
            approved: 'bg-blue-100 text-blue-800 border border-blue-300',
            accepted: 'bg-green-100 text-green-800 border border-green-300',
            rejected: 'bg-red-100 text-red-800 border border-red-300'
        };

        const labels = {
            pending: 'معلق',
            approved: 'انتظار',
            accepted: 'انتظار نهائي',
            rejected: 'مرفوض'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded ${badges[status] || badges.pending}`}>
                {labels[status] || status}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="قبولات الطلاب" />

            <div className="p-6">
                <div className="bg-white border-2 border-gray-300 shadow-sm">
                    {/* Header */}
                    <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">قبولات الطلاب</h2>
                                <p className="text-gray-600 text-sm">إدارة القبولات النهائية للطلاب المعتمدين</p>
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-bold text-blue-600">{filteredApplications.length}</span>
                                <span className="text-gray-500 text-sm block">طلب معتمد</span>
                            </div>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.message && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 m-6">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm">{flash.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="p-6 border-b border-gray-300 bg-gray-50">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="البحث بالاسم، الموبايل، أو القسم..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <div className="text-sm text-gray-600">
                                عرض {filteredApplications.length} من أصل {applications.length} طلب
                            </div>
                        </div>
                    </div>

                    {/* Applications Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">#</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">رقم الطلب</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">اسم الطالب</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">القسم</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">الجامعة</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">رقم الموبايل</th>
                                    <th className="text-right p-4 font-medium text-gray-700 border-l border-gray-300">تاريخ الاعتماد</th>
                                    <th className="text-right p-4 font-medium text-gray-700">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((application, index) => (
                                        <tr key={application.id} className="border-b border-gray-300 hover:bg-gray-50">
                                            <td className="p-4 border-l border-gray-300">{index + 1}</td>
                                            <td className="p-4 border-l border-gray-300 font-mono text-sm">{application.application_number}</td>
                                            <td className="p-4 border-l border-gray-300 font-medium">{application.name}</td>
                                            <td className="p-4 border-l border-gray-300">{application.department}</td>
                                            <td className="p-4 border-l border-gray-300">{application.university?.name}</td>
                                            <td className="p-4 border-l border-gray-300 font-mono">{application.mobile}</td>
                                            <td className="p-4 border-l border-gray-300">
                                                {application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString('en-GB') : '-'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    {application.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleAccept(application)}
                                                            className="px-3 py-1 bg-green-600 text-white text-sm hover:bg-green-700 transition-colors duration-200"
                                                        >
                                                            قبول نهائي
                                                        </button>
                                                    )}
                                                    {application.status === 'accepted' && (
                                                        <div className="flex gap-2">
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 text-sm border border-green-300">
                                                                ✅ انتظار نهائي
                                                            </span>
                                                            {application.acceptance_file && (
                                                                <a
                                                                    href={`/application/${application.application_number}/acceptance-pdf`}
                                                                    target="_blank"
                                                                    className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors duration-200"
                                                                >
                                                                    📄 تحميل PDF
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-gray-500">
                                            لا توجد طلبات معتمدة للقبول النهائي
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Accept Modal */}
            {showAcceptModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white border-2 border-gray-300 shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
                        <form onSubmit={submitAccept}>
                            <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                                <h3 className="text-lg font-bold text-gray-800">قبول نهائي للطالب</h3>
                                <p className="text-gray-600 text-sm">إرفاق ملف القبول وتأكيد القبول النهائي</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* معلومات الطالب */}
                                <div className="bg-blue-50 border border-blue-200 p-4">
                                    <h4 className="font-bold text-blue-800 mb-3">معلومات الطالب</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div><span className="font-medium">الاسم:</span> {selectedApplication.name}</div>
                                        <div><span className="font-medium">رقم الطلب:</span> {selectedApplication.application_number}</div>
                                        <div><span className="font-medium">القسم:</span> {selectedApplication.department}</div>
                                        <div><span className="font-medium">المرحلة:</span> {selectedApplication.stage}</div>
                                        <div><span className="font-medium">الجامعة:</span> {selectedApplication.university?.name}</div>
                                        <div><span className="font-medium">رقم الموبايل:</span> {selectedApplication.mobile}</div>
                                    </div>
                                </div>

                                {/* رفع ملف القبول */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        ملف القبول النهائي *
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => setAcceptData('acceptance_file', e.target.files[0])}
                                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                        required
                                    />
                                    <div className="bg-yellow-50 border border-yellow-200 p-3 mt-2">
                                        <p className="text-yellow-800 text-sm font-medium mb-1">ملاحظات مهمة:</p>
                                        <ul className="text-yellow-700 text-xs space-y-1">
                                            <li>• ارفق صورة أو ملف PDF لقرار القبول</li>
                                            <li>• تأكد من وضوح الملف وقابليته للقراءة</li>
                                            <li>• الحد الأقصى لحجم الملف: 5 ميجابايت</li>
                                            <li>• سيتم إرسال هذا الملف للطالب عند الاستعلام</li>
                                        </ul>
                                    </div>
                                    {acceptErrors.acceptance_file && (
                                        <div className="text-red-600 text-sm mt-1">{acceptErrors.acceptance_file}</div>
                                    )}
                                </div>

                                {/* تأكيد */}
                                <div className="bg-green-50 border border-green-200 p-4">
                                    <p className="text-green-800 text-sm">
                                        <strong>تنبيه:</strong> بعد تأكيد القبول النهائي:
                                    </p>
                                    <ul className="text-green-700 text-xs mt-2 space-y-1">
                                        <li>• سيتم إضافة الطالب إلى قاعدة بيانات الطلاب</li>
                                        <li>• سيتمكن الطالب من الاستعلام ورؤية حالة "انتظار نهائي"</li>
                                        <li>• سيتمكن من تحميل ملف القبول</li>
                                        <li>• لا يمكن التراجع عن هذا الإجراء</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-gray-100 border-t-2 border-gray-300 px-6 py-4 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAcceptModal(false)}
                                    className="px-4 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors duration-200"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={acceptProcessing}
                                    className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {acceptProcessing ? 'جاري المعالجة...' : 'تأكيد القبول النهائي'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
