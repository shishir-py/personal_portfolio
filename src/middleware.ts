import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // Only apply to admin routes except login
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.includes('/admin/login')) {
    const token = request.cookies.get('token')?.value;

    // Check if token exists and is valid
    if (!token || !(await verifyJwtToken(token))) {
      // Redirect to login if not authenticated
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(request.url));
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};