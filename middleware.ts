import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/shop', '/about', '/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/product/');

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get auth token
  const authToken = request.cookies.get('sb-access-token')?.value;

  // Check if route requires authentication
  const userRoutes = ['/dashboard', '/profile', '/orders', '/wishlist'];
  const adminRoutes = ['/admin'];

  const isUserRoute = userRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  if ((isUserRoute || isAdminRoute) && !authToken) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For admin routes, verify role (optional - mainly handled client-side)
  // This is a basic check, more thorough validation happens on the client
  if (isAdminRoute && authToken) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        const { data: { user }, error } = await supabase.auth.getUser(authToken);

        if (!user || error) {
          const loginUrl = new URL('/auth/login', request.url);
          return NextResponse.redirect(loginUrl);
        }
      }
    } catch (error) {
      console.error('Middleware auth check error:', error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
