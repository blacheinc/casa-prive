// middleware.ts - PRODUCTION MIDDLEWARE
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

const REDIRECT_TARGET = 'https://www.xn--casapriv-i1a.com';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const host = request.headers.get('host') || '';

  // Redirect all traffic to the canonical domain
  if (!host.includes('xn--casapriv-i1a.com') && !host.includes('localhost') && !host.includes('127.0.0.1')) {
    return NextResponse.redirect(REDIRECT_TARGET + path, 308);
  }

  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/booking',
    '/tickets',
    '/menu',
    '/membership',
    '/rules',
    '/waitlist',
    '/feedback',
    '/member-card',
    '/admin/login',
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath)
  );

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    // Add user info to headers for use in pages
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-role', payload.role);
    requestHeaders.set('x-username', payload.username);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Protect API routes (except auth and public APIs)
  if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
    // Add CORS headers
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};