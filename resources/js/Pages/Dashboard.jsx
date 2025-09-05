import AppLayout from '../Layouts/AppLayout';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Dashboard() {
    const [count, setCount] = useState(0);

    const handleIncrement = () => {
        setCount(count + 1);
        toast.success('تم زيادة العدد!');
    };

    return (
        <AppLayout title="Dashboard">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-bold mb-4">مرحباً بك في Dashboard</h2>
                            <p className="mb-4">هذا مثال على صفحة React مع Laravel و Inertia.js</p>

                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="text-lg mb-2">العداد: {count}</p>
                                <button
                                    onClick={handleIncrement}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    زيادة العدد
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="top-right" />
        </AppLayout>
    );
}
