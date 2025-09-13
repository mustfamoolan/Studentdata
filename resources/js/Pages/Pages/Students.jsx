import { Head, useForm, router, Link } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';
import { useState, useCallback, useMemo } from 'react';

export default function Students({ students, universities, flash, user }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: addReset } = useForm({
        name: '',
        department: '',
        stage: 'بكالوريوس',
        gpa: '',
        university_id: '',
        date: '',
        mobile: '',
        code: '',
        profile_image: null,
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
        documents: []
    });

    // نموذج التعديل
    const { data: editData, setData: setEditData, put, processing: editProcessing, errors: editErrors, reset: editReset } = useForm({
        name: '',
        department: '',
        stage: 'بكالوريوس',
        gpa: '',
        university_id: '',
        date: '',
        mobile: '',
        code: '',
        profile_image: null,
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
        documents: []
    });

    // نموذج الحذف
    const { delete: deleteStudent, processing: deleteProcessing } = useForm();

    // تصفية الطلاب حسب البحث باستخدام useMemo للأداء
    const filteredStudents = useMemo(() => {
        if (!searchTerm.trim()) return students || [];

        const searchLower = searchTerm.toLowerCase();
        return students?.filter(student => {
            return student.name?.toLowerCase().includes(searchLower) ||
                   student.code?.toLowerCase().includes(searchLower) ||
                   student.department?.toLowerCase().includes(searchLower) ||
                   student.mobile?.includes(searchTerm);
        }) || [];
    }, [students, searchTerm]);

    const handleAddSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(addData).forEach(key => {
            if (key === 'documents' && addData[key]?.length > 0) {
                addData[key].forEach((file, index) => {
                    formData.append(`documents[${index}]`, file);
                });
            } else if (key === 'profile_image' && addData[key]) {
                formData.append('profile_image', addData[key]);
            } else {
                formData.append(key, addData[key] || '');
            }
        });

        post('/admin/students', {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setShowAddForm(false);
                addReset();
            }
        });
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        // تحويل التاريخ إلى التنسيق المطلوب yyyy-MM-dd
        const formattedDate = student.date ? student.date.split('T')[0] : '';
        setEditData({
            name: student.name,
            department: student.department,
            stage: student.stage,
            gpa: student.gpa || '',
            university_id: student.university_id,
            date: formattedDate,
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
        setShowEditModal(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        // إذا لم تكن هناك ملفات جديدة، استخدم طريقة أسرع
        if (!editData.profile_image && (!editData.documents || editData.documents.length === 0)) {
            // إرسال البيانات النصية فقط (أسرع)
            const dataToSend = { ...editData };
            delete dataToSend.profile_image;
            delete dataToSend.documents;

            put(`/admin/students/${selectedStudent.id}`, dataToSend, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEditModal(false);
                    editReset();
                    setSelectedStudent(null);
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                    alert('حدث خطأ في التحديث: ' + Object.values(errors).join(', '));
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

            router.post(`/admin/students/${selectedStudent.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowEditModal(false);
                    editReset();
                    setSelectedStudent(null);
                },
                onError: (errors) => {
                    console.log('Validation errors:', errors);
                    alert('حدث خطأ في التحديث: ' + Object.values(errors).join(', '));
                }
            });
        }
    };

    const handleDelete = (student) => {
        setSelectedStudent(student);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteStudent(`/admin/students/${selectedStudent.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setSelectedStudent(null);
            }
        });
    };

    // دالة تحديث حالة الطلب
    const handleStatusChange = (studentId, newStatus) => {
        if (confirm('هل أنت متأكد من تحديث حالة الطلب؟')) {
            router.put(`/admin/students/${studentId}/application-status`, {
                status: newStatus
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    // التحديث سيحدث تلقائياً بسبب Inertia
                }
            });
        }
    };    return (
        <AppLayout>
            <Head title="إدارة الطلاب" />

            <div className="min-h-screen bg-gray-100">
                {/* Header Section - Government Style */}
                <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
                    <div className="px-6 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">إدارة سجلات الطلاب</h1>
                                    <p className="text-blue-200 text-sm">وزارة التعليم العالي والبحث العلمي</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-lg font-semibold">إجمالي الطلاب: {students?.length || 0}</p>
                                <p className="text-blue-200 text-sm">النتائج المعروضة: {filteredStudents.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="bg-white border-b-2 border-gray-300 shadow-sm">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center space-x-4 space-x-reverse">
                                <button
                                    onClick={() => setShowAddForm(true)}
                                    className="px-6 py-2 bg-green-700 hover:bg-green-800 text-white font-medium transition-colors duration-200 border border-green-800 flex items-center space-x-2 space-x-reverse"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>إضافة طالب جديد</span>
                                </button>

                                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors duration-200 border border-blue-800">
                                    تصدير Excel
                                </button>

                                <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium transition-colors duration-200 border border-gray-700">
                                    طباعة
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 space-x-reverse">
                                <label className="text-sm font-medium text-gray-700">البحث السريع:</label>
                                <input
                                    type="text"
                                    placeholder="الاسم، الرقم الجامعي، القسم، أو رقم الهاتف..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border-2 border-gray-300 focus:border-blue-600 focus:outline-none text-sm w-80"
                                />
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="p-6">
                    <div className="bg-white border-2 border-gray-300 shadow-sm">
                        {/* Table Header */}
                        <div className="bg-gray-100 border-b-2 border-gray-300 px-4 py-3">
                            <h3 className="text-lg font-bold text-gray-800">قائمة الطلاب المسجلين</h3>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-blue-50 border-b-2 border-gray-300">
                                        <th className="border-l border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-800 w-16">الرقم</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-800 w-24">حالة الطلب</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-800 w-20">الصورة</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-800">الاسم الكامل</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-800">الرقم الجامعي</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-800">القسم</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-right text-sm font-bold text-gray-800">الجامعة</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-800">الهاتف</th>
                                        <th className="border-l border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-800">المرحلة</th>
                                        <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-32">العمليات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan="10" className="px-4 py-12 text-center text-gray-500 bg-gray-50">
                                                <div className="flex flex-col items-center space-y-2">
                                                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="text-lg font-medium">لا توجد نتائج</p>
                                                    <p className="text-sm">لا توجد بيانات طلاب مطابقة لمعايير البحث</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student, index) => {
                                            // حالة الطلب - افتراضياً معلق للجميع
                                            let applicationStatusColor = 'text-yellow-600';
                                            let applicationStatusText = 'معلق';
                                            let currentStatus = 'pending'; // الحالة الافتراضية

                                            if (student.application) {
                                                currentStatus = student.application.status;
                                                switch (student.application.status) {
                                                    case 'pending':
                                                        applicationStatusColor = 'text-yellow-600';
                                                        applicationStatusText = 'معلق';
                                                        break;
                                                    case 'approved':
                                                        applicationStatusColor = 'text-blue-600';
                                                        applicationStatusText = 'انتظار';
                                                        break;
                                                    case 'accepted':
                                                        applicationStatusColor = 'text-green-600';
                                                        applicationStatusText = 'قبول نهائي';
                                                        break;
                                                    case 'rejected':
                                                        applicationStatusColor = 'text-red-600';
                                                        applicationStatusText = 'مرفوض';
                                                        break;
                                                }
                                            }

                                            return (
                                                <tr key={student.id} className="hover:bg-gray-50 border-b border-gray-200">
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900 text-center font-medium">
                                                        {index + 1}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-center">
                                                        <select
                                                            value={currentStatus}
                                                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                            className={`${applicationStatusColor} font-medium px-2 py-1 text-xs border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                            disabled={user.role !== 'admin' && user.role !== 'supervisor'}
                                                        >
                                                            <option value="pending" className="text-yellow-600">معلق</option>
                                                            <option value="approved" className="text-blue-600">انتظار</option>
                                                            <option value="accepted" className="text-green-600">قبول نهائي</option>
                                                            <option value="rejected" className="text-red-600">مرفوض</option>
                                                        </select>
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-center">
                                                        {student.profile_image ? (
                                                            <img
                                                                className="h-10 w-10 border-2 border-gray-300 mx-auto object-cover rounded-full"
                                                                src={`/storage/${student.profile_image}`}
                                                                alt="صورة الطالب"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 bg-gray-100 border-2 border-gray-300 mx-auto flex items-center justify-center rounded-full">
                                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900">
                                                        <div className="font-medium">{student.name}</div>
                                                        {student.gpa && (
                                                            <div className="text-xs text-gray-500 mt-1">المعدل: {student.gpa}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900 font-mono text-center font-semibold">
                                                        {student.code}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900">
                                                        {student.department}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900">
                                                        <div className="font-medium">{student.university?.name || 'غير محدد'}</div>
                                                        {student.university?.location && (
                                                            <div className="text-xs text-gray-500 mt-1">{student.university.location}</div>
                                                        )}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900 font-mono text-center">
                                                        {student.mobile}
                                                    </td>
                                                    <td className="border-l border-gray-300 px-4 py-3 text-sm text-gray-900 text-center">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium">
                                                            {student.stage}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex justify-center space-x-2 space-x-reverse">
                                                            <Link
                                                                href={`/admin/students/${student.id}/profile`}
                                                                className="inline-flex items-center px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                التفاصيل
                                                            </Link>

                                                            <button
                                                                onClick={() => handleEdit(student)}
                                                                className="inline-flex items-center px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                                تعديل
                                                            </button>

                                                            <button
                                                                onClick={() => handleDelete(student)}
                                                                className="inline-flex items-center px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors duration-200"
                                                            >
                                                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                حذف
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="bg-gray-50 border-t-2 border-gray-300 px-4 py-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>إجمالي النتائج: {filteredStudents.length} طالب</span>
                                <span>تم التحديث: {new Date().toLocaleDateString('ar-SA')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Student Modal - Government Style */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white border-2 border-gray-400 w-full max-w-5xl max-h-screen overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-6 py-4 border-b-2 border-gray-400">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 space-x-reverse">
                                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">إضافة طالب جديد</h3>
                                        <p className="text-blue-200 text-sm">إدخال بيانات طالب جديد في النظام</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                            <form onSubmit={handleAddSubmit} className="p-6">
                                {/* Personal Information Section */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">البيانات الشخصية</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطالب *</label>
                                            <input
                                                type="text"
                                                value={addData.name}
                                                onChange={(e) => setAddData('name', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                required
                                                placeholder="أدخل اسم الطالب الكامل"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                                            <input
                                                type="text"
                                                value={addData.mobile}
                                                onChange={(e) => setAddData('mobile', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                required
                                                placeholder="07xxxxxxxxx"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                            <input
                                                type="date"
                                                value={addData.date}
                                                onChange={(e) => setAddData('date', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Information Section */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">البيانات الأكاديمية</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الكود *</label>
                                            <input
                                                type="text"
                                                value={addData.code}
                                                onChange={(e) => setAddData('code', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                required
                                                placeholder="أدخل كود الطالب"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                                            <input
                                                type="text"
                                                value={addData.department}
                                                onChange={(e) => setAddData('department', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                required
                                                placeholder="مثال: هندسة الحاسوب"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة</label>
                                            <select
                                                value={addData.stage}
                                                onChange={(e) => setAddData('stage', e.target.value)}
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
                                                value={addData.university_id}
                                                onChange={(e) => setAddData('university_id', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                required
                                            >
                                                <option value="">اختر الجامعة</option>
                                                {universities?.map(university => (
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
                                                value={addData.gpa}
                                                onChange={(e) => setAddData('gpa', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="مثال: 85.5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Installment Information Section */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">القسط</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">القسط</label>
                                            <input
                                                type="number"
                                                value={addData.installment_total}
                                                onChange={(e) => setAddData('installment_total', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="إجمالي القسط"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل القسط</label>
                                            <input
                                                type="number"
                                                value={addData.installment_received}
                                                onChange={(e) => setAddData('installment_received', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="المبلغ الواصل"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي القسط</label>
                                            <input
                                                type="number"
                                                value={addData.installment_remaining || ''}
                                                onChange={(e) => setAddData('installment_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="المبلغ المتبقي"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Fees Information Section */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">الأجور</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الأجور</label>
                                            <input
                                                type="number"
                                                value={addData.fees_total}
                                                onChange={(e) => setAddData('fees_total', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="إجمالي الأجور"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل الأجور</label>
                                            <input
                                                type="number"
                                                value={addData.fees_received}
                                                onChange={(e) => setAddData('fees_received', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="المبلغ الواصل"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي الأجور</label>
                                            <input
                                                type="number"
                                                value={addData.fees_remaining || ''}
                                                onChange={(e) => setAddData('fees_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                placeholder="المبلغ المتبقي"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Agent Information Section - Only visible to admins */}
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
                                                    value={addData.sender_agent}
                                                    onChange={(e) => setAddData('sender_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                    placeholder="اسم المعقب المرسل"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الأجور التي تخص المعقب المرسل</label>
                                                <input
                                                    type="number"
                                                    value={addData.sender_agent_fees}
                                                    onChange={(e) => setAddData('sender_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المستلم</label>
                                                <input
                                                    type="text"
                                                    value={addData.receiver_agent}
                                                    onChange={(e) => setAddData('receiver_agent', e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                    placeholder="اسم المعقب المستلم"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">الأجور التي تخص المعقب المستلم</label>
                                                <input
                                                    type="number"
                                                    value={addData.receiver_agent_fees}
                                                    onChange={(e) => setAddData('receiver_agent_fees', e.target.value)}
                                                    className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Files Section */}
                                <div className="mb-6">
                                    <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                        <h4 className="font-bold text-gray-800">الملفات</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الشخصية</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setAddData('profile_image', e.target.files[0])}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">المستندات</label>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setAddData('documents', Array.from(e.target.files))}
                                                className="w-full px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-blue-600 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 border-t-2 border-gray-300 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="px-6 py-2 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 font-medium transition-colors duration-200"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addProcessing}
                                        className="px-6 py-2 bg-green-700 text-white border-2 border-green-800 hover:bg-green-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {addProcessing ? 'جاري الحفظ...' : 'حفظ البيانات'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedStudent && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative py-8 mx-auto px-4 w-full max-w-7xl">
                        <div className="bg-white shadow-xl rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 text-center">
                                    تعديل بيانات الطالب - {selectedStudent.name}
                                </h3>
                            </div>

                            <form onSubmit={handleEditSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
                                <div className="p-6 space-y-6">
                                    {/* البيانات الأساسية */}
                                    <div>
                                        <div className="bg-gray-100 border border-gray-300 px-4 py-2 mb-4">
                                            <h4 className="font-bold text-gray-800">البيانات الأساسية</h4>
                                        </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">اسم الطالب *</label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData('name', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الكود *</label>
                                            <input
                                                type="text"
                                                value={editData.code}
                                                onChange={(e) => setEditData('code', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الموبايل *</label>
                                            <input
                                                type="text"
                                                value={editData.mobile}
                                                onChange={(e) => setEditData('mobile', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">القسم *</label>
                                            <input
                                                type="text"
                                                value={editData.department}
                                                onChange={(e) => setEditData('department', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">المرحلة *</label>
                                            <select
                                                value={editData.stage}
                                                onChange={(e) => setEditData('stage', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                                required
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
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
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
                                                value={editData.gpa}
                                                onChange={(e) => setEditData('gpa', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
                                            <input
                                                type="date"
                                                value={editData.date}
                                                onChange={(e) => setEditData('date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">الصورة الشخصية</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setEditData('profile_image', e.target.files[0])}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* القسط */}
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
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل القسط</label>
                                            <input
                                                type="number"
                                                value={editData.installment_received}
                                                onChange={(e) => setEditData('installment_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي القسط</label>
                                            <input
                                                type="number"
                                                value={editData.installment_remaining}
                                                onChange={(e) => setEditData('installment_remaining', e.target.value)}
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
                                                value={editData.fees_total}
                                                onChange={(e) => setEditData('fees_total', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">واصل الأجور</label>
                                            <input
                                                type="number"
                                                value={editData.fees_received}
                                                onChange={(e) => setEditData('fees_received', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">باقي الأجور</label>
                                            <input
                                                type="number"
                                                value={editData.fees_remaining}
                                                onChange={(e) => setEditData('fees_remaining', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
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
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المرسل</label>
                                            <input
                                                type="number"
                                                value={editData.sender_agent_fees}
                                                onChange={(e) => setEditData('sender_agent_fees', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">المعقب المستلم</label>
                                            <input
                                                type="text"
                                                value={editData.receiver_agent}
                                                onChange={(e) => setEditData('receiver_agent', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">أجور المعقب المستلم</label>
                                            <input
                                                type="number"
                                                value={editData.receiver_agent_fees}
                                                onChange={(e) => setEditData('receiver_agent_fees', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 justify-center pt-6 border-t border-gray-200 bg-gray-50 px-6 py-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedStudent(null);
                                            editReset();
                                        }}
                                        className="px-6 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        إلغاء
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="flex items-center justify-center px-6 py-2 bg-green-600 text-white border border-green-600 hover:bg-green-700 disabled:opacity-50 rounded-md transition-colors"
                                    >
                                        {editProcessing && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {editProcessing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                                    </button>
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && selectedStudent && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4 mb-2">
                                تأكيد حذف الطالب
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                هل أنت متأكد من رغبتك في حذف الطالب <strong>{selectedStudent.name}</strong>؟
                                <br />
                                هذا الإجراء لا يمكن التراجع عنه.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setSelectedStudent(null);
                                    }}
                                    className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-100"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteProcessing}
                                    className="px-4 py-2 bg-red-600 text-white border border-red-600 hover:bg-red-700 disabled:opacity-50"
                                >
                                    {deleteProcessing ? 'جاري الحذف...' : 'حذف'}
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
