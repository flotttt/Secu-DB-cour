import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login', '/register', '/api/login', '/api/register'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/api');

  if (isPublicPath || isStaticAsset) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get('auth');

  if (!authCookie || authCookie.value !== '1') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};