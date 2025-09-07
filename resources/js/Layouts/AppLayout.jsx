import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function AppLayout({ children, title = 'لوحة إدارة نظام الطلاب' }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { url, props } = usePage();

    // الحصول على بيانات المستخدم من session
    const user = props.auth?.user || null;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const navigation = [
        {
            name: 'الرئيسية',
            href: user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard',
            icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
            description: 'لوحة المراقبة الرئيسية'
        },
        {
            name: 'الموظفين',
            href: '/admin/employees',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
            description: 'إدارة الموظفين والرواتب'
        },
        {
            name: 'الطلاب',
            href: '/admin/students',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            description: 'إدارة قاعدة بيانات الطلاب'
        },
        {
            name: 'الطلبات',
            href: '/admin/orders',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            description: 'طلبات وتوصيات الطلاب'
        },
        {
            name: 'قبولات الطلاب',
            href: '/admin/acceptances',
            icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
            description: 'إدارة القبولات النهائية للطلاب'
        },
        {
            name: 'الجامعات',
            href: '/admin/universities',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            description: 'إدارة وتتبع جميع الجامعات'
        },
        {
            name: 'الإحصائيات',
            href: '/admin/statistics',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            description: 'تقارير وإحصائيات النظام'
        }
    ];

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={`${title} - ${user?.name || 'StudentData'}`} />

            {/* Header - Government Style */}
            <header className="bg-gradient-to-r from-blue-800 to-blue-900 border-b-4 border-blue-600 shadow-lg sticky top-0 z-50">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Right: Logo and Title */}
                        <div className="flex items-center space-x-4 space-x-reverse">
                            <div className="flex items-center space-x-3 space-x-reverse">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-6 h-6 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 6C13.1 6 14 6.9 14 8S13.1 10 12 10 10 9.1 10 8 10.9 6 12 6M12 19C9.3 19 7 16.7 7 14C7 13 7.2 12.1 7.6 11.3C8.3 12.4 10 13 12 13S15.7 12.4 16.4 11.3C16.8 12.1 17 13 17 14C17 16.7 14.7 19 12 19Z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-white font-bold text-lg">نظام إدارة الطلاب</h1>
                                    <p className="text-blue-200 text-sm">نظام إدارة شؤون الطلاب</p>
                                </div>
                            </div>
                        </div>

                        {/* Center: Current Page */}
                        <div className="hidden md:block">
                            <div className="bg-white bg-opacity-10 px-4 py-2 rounded border border-white border-opacity-20">
                                <p className="text-white font-medium text-sm">
                                    {navigation.find(item => url.startsWith(item.href))?.name || 'الصفحة الرئيسية'}
                                </p>
                            </div>
                        </div>

                        {/* Left: User Info and Time */}
                        <div className="flex items-center space-x-4 space-x-reverse">
                            {/* Time Display */}
                            <div className="hidden lg:block text-right text-white">
                                <p className="text-sm font-medium">{formatTime(currentTime)}</p>
                                <p className="text-xs text-blue-200">{formatDate(currentTime).split(',')[0]}</p>
                            </div>

                            {/* User Info */}
                            <div className="flex items-center space-x-3 space-x-reverse bg-white bg-opacity-10 px-4 py-2 rounded border border-white border-opacity-20">
                                <div className="text-right text-white">
                                    <p className="text-sm font-semibold">
                                        {user?.name || 'مستخدم النظام'}
                                    </p>
                                    <p className="text-xs text-blue-200">
                                        {user?.role === 'admin' ? 'مدير عام' : 'موظف'}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                    {user?.name ? user.name.charAt(0) : 'م'}
                                </div>
                            </div>

                            {/* Logout Button */}
                            <button
                                onClick={() => {
                                    if (confirm('هل تريد تسجيل الخروج؟')) {
                                        router.post('/logout');
                                    }
                                }}
                                className="p-2 text-white hover:bg-white hover:bg-opacity-10 rounded transition-all duration-200 border border-white border-opacity-20 hover:border-opacity-30"
                                title="تسجيل الخروج"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width */}
            <main className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto bg-gray-50">
                    {/* تحقق من الصفحة الحالية - إذا كانت dashboard فقط اعرض المربعات، وإلا اعرض المحتوى */}
                    {(url === '/admin/dashboard' || url === '/employee/dashboard') ? (
                        /* صفحة الرئيسية - تخطيط شبكي حكومي */
                        <div className="bg-gray-100">
                            {/* Navigation Grid */}
                            <div className="p-6">
                                <div className="bg-white border border-gray-300 shadow-sm">
                                    {/* Header */}
                                    <div className="bg-blue-50 border-b border-gray-300 px-6 py-4">
                                        <h2 className="text-xl font-bold text-gray-800 text-center">
                                            قائمة الخدمات والأقسام
                                        </h2>
                                        <p className="text-gray-600 text-center text-sm mt-1">
                                            اختر القسم المطلوب من القائمة أدناه
                                        </p>
                                    </div>

                                    {/* Navigation Grid */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                                            {navigation.filter(item => !item.href.includes('dashboard')).map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="group block"
                                                >
                                                    <div className="border border-gray-300 bg-white hover:bg-blue-50 transition-colors duration-200 p-6 text-center">
                                                        {/* Icon */}
                                                        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center">
                                                            <svg
                                                                className="w-6 h-6"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                            </svg>
                                                        </div>

                                                        {/* Text */}
                                                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-800 text-sm mb-2">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 group-hover:text-blue-600 leading-relaxed">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="bg-gray-50 border-t border-gray-300 px-6 py-3">
                                        <p className="text-xs text-gray-500 text-center">
                                            للدعم التقني: support@education.gov | الهاتف: 0123456789
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* صفحات أخرى - عرض المحتوى بحجم الشاشة كامل */
                        <div className="h-full bg-gray-100">
                            {/* شريط التنقل العلوي */}
                            <div className="bg-white border-b-2 border-gray-300 px-6 py-3 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <Link
                                        href={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
                                        className="inline-flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium transition-colors duration-200 space-x-2 space-x-reverse border border-blue-800"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        <span>العودة للصفحة الرئيسية</span>
                                    </Link>

                                    <div className="text-right">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {navigation.find(item => url.startsWith(item.href))?.name || 'إدارة النظام'}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {navigation.find(item => url.startsWith(item.href))?.description || 'نظام إدارة شؤون الطلاب'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* محتوى الصفحة */}
                            <div className="h-full bg-white">
                                {children}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
