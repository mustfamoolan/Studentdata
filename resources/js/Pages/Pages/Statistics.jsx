import { Head } from '@inertiajs/react';
import AppLayout from '../../Layouts/AppLayout';

export default function Statistics() {
    return (
        <AppLayout title="الإحصائيات والتقارير">
            <div className="p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">الإحصائيات والتقارير</h1>

                    <div className="bg-white shadow-sm rounded-lg p-8">
                        <div className="text-center">
                            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-4 text-xl font-medium text-gray-900">صفحة الإحصائيات والتقارير</h3>
                            <p className="mt-2 text-gray-500">هنا يمكنك مشاهدة جميع التقارير والإحصائيات المهمة</p>
                            <p className="mt-4 text-sm text-blue-600">قريباً سيتم إضافة المزيد من الميزات...</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
