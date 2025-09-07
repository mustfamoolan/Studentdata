import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

export default function Orders({ applications = [], flash, user }) {
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showConvertModal, setShowConvertModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // نموذج تحديث الحالة
    const { data: statusData, setData: setStatusData, put: updateStatus, processing: statusProcessing, errors: statusErrors, reset: resetStatus } = useForm({
        status: '',
        admin_notes: '',
    });

    // نموذج تحويل لطالب
    const { data: convertData, setData: setConvertData, post: convertStudent, processing: convertProcessing, errors: convertErrors, reset: resetConvert } = useForm({
        code: '',
        date: '',
        installment_total: 0,
        installment_received: 0,
        installment_remaining: 0,
        fees_total: 0,
        fees_received: 0,
        fees_remaining: 0,
        sender_agent: '',
        sender_agent_fees: 0,
        receiver_agent: '',
        receiver_agent_fees: 0,
    });

    // تصفية الطلبات - إخفاء الطلبات المقبولة
    const filteredApplications = applications.filter(app => {
        // إخفاء الطلبات المقبولة (التي تم تحويلها لطلاب)
        if (app.status === 'approved') return false;

        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             app.mobile.includes(searchTerm) ||
                             app.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleStatusUpdate = (application) => {
        setSelectedApplication(application);
        setStatusData({
            status: application.status,
            admin_notes: application.admin_notes || '',
        });
        setShowStatusModal(true);
    };

    const handleConvert = (application) => {
        setSelectedApplication(application);
        setConvertData({
            code: '',
            date: '',
            installment_total: 0,
            installment_received: 0,
            installment_remaining: 0,
            fees_total: 0,
            fees_received: 0,
            fees_remaining: 0,
            sender_agent: application.agent_name || '',
            sender_agent_fees: 0,
            receiver_agent: '',
            receiver_agent_fees: 0,
        });
        setShowConvertModal(true);
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setConvertData({
            code: '',
            date: '',
            installment_total: 0,
            installment_received: 0,
            installment_remaining: 0,
            fees_total: 0,
            fees_received: 0,
            fees_remaining: 0,
            sender_agent: application.agent_name || '',
            sender_agent_fees: 0,
            receiver_agent: '',
            receiver_agent_fees: 0,
        });
        setShowViewModal(true);
    };

    const submitStatusUpdate = (e) => {
        e.preventDefault();
        console.log('Updating status for application:', selectedApplication);
        if (!selectedApplication || !selectedApplication.id) {
            console.error('No selected application or ID');
            return;
        }

        router.put(`/admin/applications/${selectedApplication.id}/status`, {
            status: statusData.status,
            admin_notes: statusData.admin_notes
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowStatusModal(false);
                resetStatus();
            }
        });
    };

    const submitConvert = (e) => {
        e.preventDefault();
        console.log('Converting application:', selectedApplication);
        if (!selectedApplication || !selectedApplication.id) {
            console.error('No selected application or ID');
            return;
        }

        router.post(`/admin/applications/${selectedApplication.id}/convert`, {
            code: convertData.code,
            date: convertData.date,
            installment_total: convertData.installment_total,
            installment_received: convertData.installment_received,
            installment_remaining: convertData.installment_remaining,
            fees_total: convertData.fees_total,
            fees_received: convertData.fees_received,
            fees_remaining: convertData.fees_remaining,
            sender_agent: convertData.sender_agent,
            sender_agent_fees: convertData.sender_agent_fees,
            receiver_agent: convertData.receiver_agent,
            receiver_agent_fees: convertData.receiver_agent_fees
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowConvertModal(false);
                resetConvert();
            }
        });
    };

    const submitDirectConvert = (e) => {
        e.preventDefault();
        console.log('Accepting application:', selectedApplication);
        if (!selectedApplication || !selectedApplication.id) {
            console.error('No selected application or ID');
            return;
        }

        // منع الإرسال المضاعف
        if (convertProcessing) {
            console.log('Already processing, preventing duplicate submission');
            return;
        }

        // التأكد من وجود الكود المطلوب
        if (!convertData.code || convertData.code.trim() === '') {
            alert('يرجى إدخال كود الطالب');
            return;
        }

        router.post(`/admin/applications/${selectedApplication.id}/convert`, {
            code: convertData.code,
            date: convertData.date,
            installment_total: convertData.installment_total,
            installment_received: convertData.installment_received,
            installment_remaining: convertData.installment_remaining,
            fees_total: convertData.fees_total,
            fees_received: convertData.fees_received,
            fees_remaining: convertData.fees_remaining,
            sender_agent: convertData.sender_agent,
            sender_agent_fees: convertData.sender_agent_fees,
            receiver_agent: convertData.receiver_agent,
            receiver_agent_fees: convertData.receiver_agent_fees
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowViewModal(false);
                resetConvert();
                // إعادة تحديث البيانات
                router.visit('/admin/orders', {
                    preserveState: false,
                    preserveScroll: false
                });
            },
            onError: (errors) => {
                console.error('Error accepting application:', errors);
            }
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };

        const texts = {
            pending: 'معلق',
            approved: 'مقبول',
            rejected: 'مرفوض'
        };

        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {texts[status] || status}
            </span>
        );
    };

    return (
        <AppLayout title="إدارة الطلبات">
            <Head title="إدارة الطلبات" />

            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة طلبات التسجيل</h1>
                        <p className="text-gray-600">مراجعة وإدارة طلبات التسجيل المقدمة من الطلاب</p>
                    </div>

                    {/* Flash Messages */}
                    {flash?.message && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3">
                            {flash.message}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3">
                            {flash.error}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="bg-white border-2 border-gray-300 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                    placeholder="البحث بالاسم أو الرقم أو القسم..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">تصفية بالحالة</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                >
                                    <option value="all">جميع الحالات</option>
                                    <option value="pending">معلق</option>
                                    <option value="rejected">مرفوض</option>
                                </select>
                            </div>

                            <div className="flex items-end">
                                <div className="bg-blue-50 border border-blue-200 p-3 text-center">
                                    <div className="text-2xl font-bold text-blue-800">{filteredApplications.length}</div>
                                    <div className="text-sm text-blue-600">إجمالي الطلبات</div>
                                </div>
                            </div>

                            <div className="flex items-end">
                                <div className="bg-green-50 border border-green-200 p-3 text-center">
                                    <div className="text-2xl font-bold text-green-800">
                                        {filteredApplications.filter(app => app.status === 'pending').length}
                                    </div>
                                    <div className="text-sm text-green-600">طلبات معلقة</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Applications Table */}
                    <div className="bg-white border-2 border-gray-300 overflow-hidden">
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                            <h3 className="text-lg font-bold text-gray-800">قائمة الطلبات</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y-2 divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                                            الطالب
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                                            المعلومات الأكاديمية
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                                            الحالة
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-r-2 border-gray-300">
                                            تاريخ التقديم
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            الإجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredApplications.map((application) => (
                                        <tr key={application.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-300">
                                                <div className="flex items-center">
                                                    {application.profile_image && (
                                                        <div className="flex-shrink-0 h-10 w-10 ml-4">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover border-2 border-gray-300"
                                                                src={`/storage/${application.profile_image}`}
                                                                alt={application.name}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {application.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {application.mobile}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-300">
                                                <div className="text-sm text-gray-900">
                                                    <div className="font-medium">{application.department}</div>
                                                    <div>{application.stage}</div>
                                                    <div className="text-gray-500">{application.university?.name}</div>
                                                    {application.gpa && (
                                                        <div className="text-blue-600">المعدل: {application.gpa}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap border-r-2 border-gray-300">
                                                {getStatusBadge(application.status)}
                                                {application.reviewed_at && (
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(application.reviewed_at).toLocaleDateString('ar-EG')}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r-2 border-gray-300">
                                                {new Date(application.created_at).toLocaleDateString('ar-EG')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleViewDetails(application)}
                                        className="px-3 py-1 bg-purple-700 text-white border-2 border-purple-800 hover:bg-purple-800 text-xs transition-colors duration-200"
                                    >
                                        مراجعة الطلب
                                    </button>                                                    <button
                                                        onClick={() => handleStatusUpdate(application)}
                                                        className="px-3 py-1 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 text-xs transition-colors duration-200"
                                                    >
                                                        تحديث الحالة
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {filteredApplications.length === 0 && (
                                <div className="text-center py-8">
                                    <div className="text-gray-500 text-lg">لا توجد طلبات</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg bg-white">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                تحديث حالة الطلب
                            </h3>

                            <form onSubmit={submitStatusUpdate} action="#">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
                                    <select
                                        value={statusData.status}
                                        onChange={(e) => setStatusData('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                        required
                                    >
                                        <option value="pending">معلق</option>
                                        <option value="rejected">مرفوض</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات الإدارة</label>
                                    <textarea
                                        value={statusData.admin_notes}
                                        onChange={(e) => setStatusData('admin_notes', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                        rows="3"
                                        placeholder="ملاحظات اختيارية..."
                                    />
                                </div>

                                <div className="flex gap-3 justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusModal(false)}
                                        className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={statusProcessing}
                                        className="px-4 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {statusProcessing ? 'جاري الحفظ...' : 'حفظ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Convert to Student Modal */}
            {showConvertModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
                                تحويل الطلب إلى طالب مسجل
                            </h3>

                            <form onSubmit={submitConvert} action="#" className="max-h-96 overflow-y-auto p-4">
                                {/* البيانات الأساسية */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">البيانات الأساسية</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الكود *</label>
                                            <input
                                                type="text"
                                                value={convertData.code}
                                                onChange={(e) => setConvertData('code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                            <input
                                                type="date"
                                                value={convertData.date}
                                                onChange={(e) => setConvertData('date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
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
                                                value={convertData.installment_total}
                                                onChange={(e) => setConvertData('installment_total', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل القسط</label>
                                            <input
                                                type="number"
                                                value={convertData.installment_received}
                                                onChange={(e) => setConvertData('installment_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي القسط</label>
                                            <input
                                                type="number"
                                                value={convertData.installment_remaining}
                                                onChange={(e) => setConvertData('installment_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
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
                                                value={convertData.fees_total}
                                                onChange={(e) => setConvertData('fees_total', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل الأجور</label>
                                            <input
                                                type="number"
                                                value={convertData.fees_received}
                                                onChange={(e) => setConvertData('fees_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي الأجور</label>
                                            <input
                                                type="number"
                                                value={convertData.fees_remaining}
                                                onChange={(e) => setConvertData('fees_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* المعقبين - فقط للأدمن */}
                                {user?.role === 'admin' && (
                                    <div className="mb-6">
                                        <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                            <h4 className="font-bold text-gray-800">بيانات المعقبين</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المرسل</label>
                                                <input
                                                    type="text"
                                                    value={convertData.sender_agent}
                                                    onChange={(e) => setConvertData('sender_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المرسل</label>
                                                <input
                                                    type="number"
                                                    value={convertData.sender_agent_fees}
                                                    onChange={(e) => setConvertData('sender_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المستلم</label>
                                                <input
                                                    type="text"
                                                    value={convertData.receiver_agent}
                                                    onChange={(e) => setConvertData('receiver_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المستلم</label>
                                                <input
                                                    type="number"
                                                    value={convertData.receiver_agent_fees}
                                                    onChange={(e) => setConvertData('receiver_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 justify-center pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowConvertModal(false)}
                                        className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={convertProcessing}
                                        className="px-6 py-2 bg-green-600 text-white border border-green-600 hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {convertProcessing ? 'جاري التحويل...' : 'تحويل إلى طالب'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {showViewModal && selectedApplication && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-5 mx-auto p-5 border w-full max-w-6xl shadow-lg bg-white">
                        <div className="mt-3">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                                مراجعة طلب التسجيل - {selectedApplication.name}
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                {/* البيانات الأساسية */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">البيانات المرسلة من الطالب</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">اسم الطالب</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الموبايل</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.mobile}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.department}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">المرحلة</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.stage}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">الجامعة</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.university?.name}
                                            </div>
                                        </div>
                                        {selectedApplication.gpa && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">المعدل</label>
                                                <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                    {selectedApplication.gpa}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">حالة الطلب</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {getStatusBadge(selectedApplication.status)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التقديم</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {new Date(selectedApplication.created_at).toLocaleDateString('ar-EG')}
                                            </div>
                                        </div>
                                    </div>

                                    {selectedApplication.admin_notes && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات الإدارة</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-300 text-sm">
                                                {selectedApplication.admin_notes}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* المستندات والصور */}
                                <div>
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">المستندات المرفقة</h4>
                                    </div>

                                    <div className="space-y-4">
                                        {selectedApplication.profile_image && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الشخصية</label>
                                                <img
                                                    src={`/storage/${selectedApplication.profile_image}`}
                                                    alt="صورة شخصية"
                                                    className="w-full h-32 object-cover border border-gray-300 rounded"
                                                />
                                            </div>
                                        )}

                                        {selectedApplication.passport_image && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">صورة جواز السفر</label>
                                                <img
                                                    src={`/storage/${selectedApplication.passport_image}`}
                                                    alt="جواز السفر"
                                                    className="w-full h-32 object-cover border border-gray-300 rounded cursor-pointer"
                                                    onClick={() => window.open(`/storage/${selectedApplication.passport_image}`, '_blank')}
                                                />
                                            </div>
                                        )}

                                        {selectedApplication.certificate_image && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">صورة الشهادة</label>
                                                <img
                                                    src={`/storage/${selectedApplication.certificate_image}`}
                                                    alt="الشهادة"
                                                    className="w-full h-32 object-cover border border-gray-300 rounded cursor-pointer"
                                                    onClick={() => window.open(`/storage/${selectedApplication.certificate_image}`, '_blank')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* نموذج إكمال البيانات وقبول الطلب */}
                            <form onSubmit={submitDirectConvert} action="#" className="border-t pt-6">
                                <div className="bg-blue-50 border border-blue-300 px-4 py-2 mb-6">
                                    <h4 className="font-bold text-blue-800">قبول الطلب وإضافة الطالب</h4>
                                    <p className="text-sm text-blue-600">املأ الحقول التالية وانقر "قبول الطلب" لإضافة الطالب إلى النظام</p>
                                </div>

                                {/* البيانات الأساسية */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">البيانات الأساسية</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الكود *</label>
                                            <input
                                                type="text"
                                                value={convertData.code}
                                                onChange={(e) => setConvertData('code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                                placeholder="أدخل كود الطالب"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                            <input
                                                type="date"
                                                value={convertData.date}
                                                onChange={(e) => setConvertData('date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
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
                                                value={convertData.installment_total}
                                                onChange={(e) => setConvertData('installment_total', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل القسط</label>
                                            <input
                                                type="number"
                                                value={convertData.installment_received}
                                                onChange={(e) => setConvertData('installment_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي القسط</label>
                                            <input
                                                type="number"
                                                value={convertData.installment_remaining}
                                                onChange={(e) => setConvertData('installment_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
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
                                                value={convertData.fees_total}
                                                onChange={(e) => setConvertData('fees_total', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل الأجور</label>
                                            <input
                                                type="number"
                                                value={convertData.fees_received}
                                                onChange={(e) => setConvertData('fees_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي الأجور</label>
                                            <input
                                                type="number"
                                                value={convertData.fees_remaining}
                                                onChange={(e) => setConvertData('fees_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* المعقبين - فقط للأدمن */}
                                {user?.role === 'admin' && (
                                    <div className="mb-6">
                                        <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                            <h4 className="font-bold text-gray-800">بيانات المعقبين</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المرسل</label>
                                                <input
                                                    type="text"
                                                    value={convertData.sender_agent}
                                                    onChange={(e) => setConvertData('sender_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                    placeholder="اسم المعقب المرسل"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المرسل</label>
                                                <input
                                                    type="number"
                                                    value={convertData.sender_agent_fees}
                                                    onChange={(e) => setConvertData('sender_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المستلم</label>
                                                <input
                                                    type="text"
                                                    value={convertData.receiver_agent}
                                                    onChange={(e) => setConvertData('receiver_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                    placeholder="اسم المعقب المستلم"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المستلم</label>
                                                <input
                                                    type="number"
                                                    value={convertData.receiver_agent_fees}
                                                    onChange={(e) => setConvertData('receiver_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3 justify-center pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowViewModal(false)}
                                        className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
                                    >
                                        إغلاق
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={convertProcessing}
                                        className="px-6 py-2 bg-green-600 text-white border border-green-600 hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {convertProcessing ? 'جاري قبول الطلب...' : 'قبول الطلب وإضافة للطلاب'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
