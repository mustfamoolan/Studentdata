import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState } from 'react';

export default function Universities({ universities, flash }) {
    const [editingUniversity, setEditingUniversity] = useState(null);

    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        name: '',
    });

    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors } = useForm({
        name: '',
    });

    const handleAdd = (e) => {
        e.preventDefault();
        post('/admin/universities', {
            onSuccess: () => {
                addReset();
            }
        });
    };

    const handleEdit = (university) => {
        setEditingUniversity(university);
        setEditData('name', university.name);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(`/admin/universities/${editingUniversity.id}`, {
            onSuccess: () => {
                setEditingUniversity(null);
            }
        });
    };

    const handleDelete = (university) => {
        if (confirm(`هل أنت متأكد من حذف جامعة "${university.name}"؟`)) {
            router.delete(`/admin/universities/${university.id}`);
        }
    };

    return (
        <AppLayout title="إدارة الجامعات">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">إدارة الجامعات</h1>

                        {/* Flash Messages */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                {flash.success}
                            </div>
                        )}

                        {/* Add Form */}
                        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">إضافة جامعة جديدة</h2>
                            <form onSubmit={handleAdd} className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={addData.name}
                                        onChange={(e) => setAddData('name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="أدخل اسم الجامعة"
                                        required
                                    />
                                    {addErrors.name && <p className="mt-1 text-sm text-red-600">{addErrors.name}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={addProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {addProcessing ? 'جاري الإضافة...' : 'إضافة'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Universities Table */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">قائمة الجامعات ({universities.length})</h3>
                        </div>

                        {universities.length === 0 ? (
                            <div className="px-6 py-12 text-center text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="text-lg">لا توجد جامعات مضافة بعد</p>
                                <p className="text-sm text-gray-400 mt-1">ابدأ بإضافة أول جامعة من الأعلى</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                اسم الجامعة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                                                تاريخ الإضافة
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                                                العمليات
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {universities.map((university, index) => (
                                            <tr key={university.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {editingUniversity?.id === university.id ? (
                                                        <form onSubmit={handleUpdate} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={editData.name}
                                                                onChange={(e) => setEditData('name', e.target.value)}
                                                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                required
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={editProcessing}
                                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                                                            >
                                                                حفظ
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setEditingUniversity(null)}
                                                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200"
                                                            >
                                                                إلغاء
                                                            </button>
                                                        </form>
                                                    ) : (
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {university.name}
                                                        </div>
                                                    )}
                                                    {editErrors.name && editingUniversity?.id === university.id && (
                                                        <p className="mt-1 text-sm text-red-600">{editErrors.name}</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(university.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {editingUniversity?.id === university.id ? null : (
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleEdit(university)}
                                                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                                            >
                                                                تعديل
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(university)}
                                                                className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                                                            >
                                                                حذف
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
