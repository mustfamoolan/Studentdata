import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../Layouts/AppLayout';

export default function Employees({ employees = [], flash }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // نموذج إضافة موظف جديد
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        password: '',
    });

    // نموذج تعديل الموظف
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        name: '',
        phone: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/employees', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowModal(false);
            }
        });
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setEditData({
            name: employee.name,
            phone: employee.phone,
            password: '', // كلمة المرور فارغة في التعديل
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/admin/employees/${editingEmployee.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                resetEdit();
                setShowEditModal(false);
                setEditingEmployee(null);
            }
        });
    };

    const handleDelete = (employee) => {
        if (confirm(`هل أنت متأكد من حذف الموظف "${employee.name}"؟`)) {
            useForm().delete(`/admin/employees/${employee.id}`, {
                preserveScroll: true,
            });
        }
    };

    // تصفية الموظفين حسب البحث
    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.phone.includes(searchTerm)
    );

    return (
        <AppLayout title="إدارة الموظفين">
            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold">إدارة الموظفين</h1>
                                <p className="text-blue-200 mt-1">إضافة وإدارة حسابات الموظفين</p>
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-semibold">عدد الموظفين</div>
                                <div className="text-3xl font-bold">{employees.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.message && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mb-4">
                            {flash.message}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4">
                            {flash.error}
                        </div>
                    )}

                    {/* Controls */}
                    <div className="bg-white border-2 border-gray-300 p-4 mb-6">
                        <div className="flex justify-between items-center gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="البحث عن موظف (الاسم أو رقم الهاتف)..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600"
                                />
                            </div>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-6 py-2 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-medium transition-colors duration-200"
                            >
                                إضافة موظف جديد
                            </button>
                        </div>
                    </div>

                    {/* Employees Table */}
                    <div className="bg-white border-2 border-gray-300">
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-3">
                            <h3 className="font-bold text-gray-800">قائمة الموظفين</h3>
                        </div>

                        {filteredEmployees.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b-2 border-gray-300">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-sm font-bold text-gray-800 border-l border-gray-300">#</th>
                                            <th className="px-6 py-3 text-right text-sm font-bold text-gray-800 border-l border-gray-300">اسم الموظف</th>
                                            <th className="px-6 py-3 text-right text-sm font-bold text-gray-800 border-l border-gray-300">رقم الهاتف</th>
                                            <th className="px-6 py-3 text-right text-sm font-bold text-gray-800 border-l border-gray-300">تاريخ التسجيل</th>
                                            <th className="px-6 py-3 text-right text-sm font-bold text-gray-800">الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.map((employee, index) => (
                                            <tr key={employee.id} className="border-b border-gray-300 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900 border-l border-gray-300">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 border-l border-gray-300">
                                                    {employee.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 border-l border-gray-300">
                                                    {employee.phone}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 border-l border-gray-300">
                                                    {new Date(employee.created_at).toLocaleDateString('ar-EG')}
                                                </td>
                                                <td className="px-6 py-4 text-sm space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(employee)}
                                                        className="inline-flex items-center px-3 py-1 border-2 border-blue-600 text-blue-700 hover:bg-blue-50 text-xs font-medium transition-colors duration-200 ml-2"
                                                    >
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(employee)}
                                                        className="inline-flex items-center px-3 py-1 border-2 border-red-600 text-red-700 hover:bg-red-50 text-xs font-medium transition-colors duration-200"
                                                    >
                                                        حذف
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">لا توجد موظفين</h3>
                                <p className="mt-2 text-gray-500">ابدأ بإضافة موظف جديد</p>
                            </div>
                        )}
                    </div>

                    {/* Add Employee Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white border-2 border-gray-400 max-w-md w-full mx-4">
                                <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                                    <h3 className="text-lg font-bold text-gray-900">إضافة موظف جديد</h3>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموظف *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            placeholder="07XXXXXXXXX"
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور *</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                                    </div>

                                    <div className="flex justify-end gap-3 border-t-2 border-gray-300 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-6 py-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-6 py-2 bg-blue-700 text-white border-2 border-blue-800 hover:bg-blue-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {processing ? 'جاري الحفظ...' : 'إضافة الموظف'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Edit Employee Modal */}
                    {showEditModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white border-2 border-gray-400 max-w-md w-full mx-4">
                                <div className="bg-gray-100 border-b-2 border-gray-300 px-6 py-4">
                                    <h3 className="text-lg font-bold text-gray-900">تعديل بيانات الموظف</h3>
                                </div>

                                <form onSubmit={handleUpdate} className="p-6">
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم الموظف *</label>
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData('name', e.target.value)}
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        {editErrors.name && <p className="text-red-600 text-xs mt-1">{editErrors.name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                                        <input
                                            type="text"
                                            value={editData.phone}
                                            onChange={(e) => setEditData('phone', e.target.value)}
                                            placeholder="07XXXXXXXXX"
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            required
                                        />
                                        {editErrors.phone && <p className="text-red-600 text-xs mt-1">{editErrors.phone}</p>}
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور الجديدة</label>
                                        <input
                                            type="password"
                                            value={editData.password}
                                            onChange={(e) => setEditData('password', e.target.value)}
                                            placeholder="اتركها فارغة إذا كنت لا تريد تغييرها"
                                            className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                        />
                                        {editErrors.password && <p className="text-red-600 text-xs mt-1">{editErrors.password}</p>}
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
                </div>
            </div>
        </AppLayout>
    );
}
