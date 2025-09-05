import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';

export default function AdminLayout({ children, title = 'لوحة المقر الرئيسي' }) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { url, props } = usePage();

    // الحصول على بيانات المستخدم من session
    const user = props.auth?.admin_user || props.admin_user || null;

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const navigation = [
        {
            name: 'الرئيسية',
            href: '/admin/dashboard',
            icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z',
            description: 'لوحة المراقبة الرئيسية'
        },
        {
            name: 'بيع على أرض المكتب',
            href: '/admin/office-sales',
            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
            description: 'نقطة بيع المكتب المباشر'
        },
        {
            name: 'فاتورة شراء',
            href: '/admin/purchase-invoices',
            icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
            description: 'إدارة فواتير الشراء من الموردين'
        },
        {
            name: 'فاتورة مرتجع بيع',
            href: '/admin/sales-returns',
            icon: 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6',
            description: 'إدارة مرتجعات البيع'
        },
        {
            name: 'الزبائن',
            href: '/admin/customers',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            description: 'إدارة قاعدة بيانات العملاء'
        },
        {
            name: 'وصل قبض',
            href: '/admin/receipts',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            description: 'وصولات القبض من العملاء'
        },
        {
            name: 'وصل دفع',
            href: '/admin/payments',
            icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
            description: 'وصولات الدفع للموردين'
        },
        {
            name: 'قيد مركب',
            href: '/admin/compound-entries',
            icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
            description: 'القيود المحاسبية المركبة'
        },
        {
            name: 'كشف حركة مادة',
            href: '/admin/material-movement',
            icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4',
            description: 'تتبع حركة المواد والمنتجات'
        },
        {
            name: 'كشف حساب زبون',
            href: '/admin/customer-account',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            description: 'كشف حساب العملاء التفصيلي'
        },
        {
            name: 'كشف مشتريات من الموردين',
            href: '/admin/supplier-purchases',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            description: 'تقارير المشتريات من الموردين'
        },
        {
            name: 'كشف مشتريات الزبائن',
            href: '/admin/customer-purchases',
            icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
            description: 'تقارير مشتريات العملاء'
        },
        {
            name: 'كشف مشتريات موظفين',
            href: '/admin/employee-purchases',
            icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
            description: 'تقارير مشتريات الموظفين'
        },
        {
            name: 'كشف حساب ديون عامة',
            href: '/admin/general-debts',
            icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
            description: 'كشف الديون العامة والمستحقات'
        },
        {
            name: 'كشف الأرباح عامة',
            href: '/admin/general-profits',
            icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
            description: 'تقارير الأرباح العامة'
        },
        {
            name: 'الموردين',
            href: '/admin/suppliers',
            icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
            description: 'إدارة وتتبع جميع الموردين'
        },
        {
            name: 'المندوبين',
            href: '/admin/representatives',
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
            description: 'إدارة فريق المبيعات والرواتب والخطط'
        },
        {
            name: 'إدارة الموظفين',
            href: '/admin/employees',
            icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
            description: 'إدارة الموظفين والرواتب'
        },
        {
            name: 'المخزن',
            href: '/admin/products',
            icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7m-7 0l7-7',
            description: 'إدارة المخزون والمواد'
        },
        {
            name: 'طلبات المندوب',
            href: '/admin/representative-orders',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
            description: 'طلبات وتوصيات المندوبين'
        },
        {
            name: 'كشف حركات الصندوق',
            href: '/admin/cash-flow',
            icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
            description: 'تتبع حركات الصندوق والنقد'
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
            <Head title={`${title} - ${user?.name || 'DubaiExchange'}`} />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm backdrop-blur-md bg-opacity-95 sticky top-0 z-50">
                <div className="px-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-12 sm:h-14">
                        {/* Left: Menu and Logo */}
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 space-x-reverse">
                            {/* Menu toggle - only visible on mobile */}
                            <button
                                onClick={() => window.location.reload()}
                                className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20"
                                title="تحديث الصفحة"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>

                            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                </div>
                                <div className="hidden xs:block sm:block">
                                    <h1 className="text-xs sm:text-sm font-semibold text-gray-900">
                                        DubaiExchange - {user?.name || 'المقر الرئيسي'}
                                    </h1>
                                    <p className="text-xs text-gray-500 hidden sm:block">
                                        {navigation.find(item => url.startsWith(item.href))?.name || 'الرئيسية'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Center: Search Bar (Desktop) */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="البحث..."
                                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none transition-all duration-200"
                                />
                                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Right: Status and User */}
                        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 space-x-reverse">
                            {/* Time Display */}
                            <div className="hidden md:block text-right">
                                <p className="text-xs font-medium text-gray-900">{formatTime(currentTime)}</p>
                                <p className="text-xs text-gray-500">{formatDate(currentTime).split('،')[0]}</p>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full"></span>
                                </span>
                            </button>

                            {/* User Profile */}
                            <div className="flex items-center space-x-1 sm:space-x-2 space-x-reverse">
                                <div className="hidden lg:block text-right">
                                    <p className="text-xs font-semibold text-gray-900">
                                        {user?.name || 'مستخدم النظام'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {user?.type === 'admin' ? 'مدير عام' : 'موظف'}
                                    </p>
                                </div>
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold">
                                    {user?.name ? user.name.charAt(0) : 'م'}
                                </div>
                            </div>

                            {/* Settings/Logout */}
                            <button
                                onClick={() => {
                                    if (confirm('هل تريد تسجيل الخروج؟')) {
                                        router.post('/logout');
                                    }
                                }}
                                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-20"
                                title="خروج"
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
                    {url === '/admin/dashboard' ? (
                        /* صفحة الرئيسية - مربعات التنقل فقط */
                        <div className="p-4 sm:p-6 lg:p-8">
                            <div className="max-w-7xl mx-auto">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">لوحة إدارة المقر الرئيسي</h2>

                                {/* Grid of Navigation Cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                    {navigation.filter(item => item.href !== '/admin/dashboard').map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="group relative bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                                        >
                                            {/* Icon */}
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 bg-gray-100 text-gray-600 group-hover:bg-blue-500 group-hover:text-white rounded-xl flex items-center justify-center transition-all duration-300">
                                                <svg
                                                    className="w-6 h-6 sm:w-7 sm:h-7"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                                </svg>
                                            </div>

                                            {/* Text */}
                                            <div className="text-center">
                                                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm leading-relaxed text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                                                    {item.description}
                                                </p>
                                            </div>

                                            {/* Hover Effect */}
                                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* صفحات أخرى - عرض المحتوى بحجم الشاشة كامل */
                        <div className="h-full">
                            {/* زر العودة للرئيسية - ثابت في الأعلى */}
                            <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
                                <Link
                                    href="/admin/dashboard"
                                    className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 space-x-2 space-x-reverse shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    <span>العودة للرئيسية</span>
                                </Link>
                            </div>

                            {/* محتوى الصفحة - ملء الشاشة بالكامل */}
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
