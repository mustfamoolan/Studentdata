<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->role !== $role) {
            // عرض صفحة جميلة بدلاً من خطأ 403
            return Inertia::render('Errors/UnauthorizedAccess', [
                'message' => 'ليس لديك صلاحية للوصول إلى هذه الصفحة. هذه الصفحة متاحة فقط للمشرفين.'
            ]);
        }

        return $next($request);
    }
}
