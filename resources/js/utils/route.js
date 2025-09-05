// Helper function for Laravel routes in React
export function route(name, params = {}) {
    // Use the global route function
    if (typeof window !== 'undefined' && window.route) {
        return window.route(name, params);
    }

    // Fallback for basic routes
    const routes = {
        'home': '/',
        'login': '/login',
        'logout': '/logout',
        'admin.dashboard': '/admin/dashboard',
        'employee.dashboard': '/employee/dashboard',
        'dashboard': '/dashboard',
    };

    return routes[name] || '/';
}

// Also make it available globally for convenience
if (typeof window !== 'undefined' && !window.route) {
    window.route = route;
}
