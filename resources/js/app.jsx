import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Global route function that works with Laravel routes
window.route = function(name, params, absolute) {
    if (typeof window.Laravel !== 'undefined' && window.Laravel.routes) {
        const route = window.Laravel.routes[name];
        if (route) {
            return route;
        }
    }

    // Fallback routes with parameters support
    const fallbackRoutes = {
        'home': '/',
        'login': '/login',
        'logout': '/logout',
        'admin.dashboard': '/admin/dashboard',
        'employee.dashboard': '/employee/dashboard',
        'dashboard': '/dashboard',
        'students': '/admin/students',
        'orders': '/admin/orders',
        'universities': '/admin/universities',
        'employees': '/admin/employees',
        'statistics': '/admin/statistics',
        'applications.updateStatus': (params) => `/admin/applications/${params}/status`,
        'applications.convert': (params) => `/admin/applications/${params}/convert`,
    };

    if (typeof fallbackRoutes[name] === 'function') {
        return fallbackRoutes[name](params);
    }

    return fallbackRoutes[name] || '/';
};createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
