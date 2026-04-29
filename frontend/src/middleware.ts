import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques (pas besoin d'auth)
  const publicPaths = ['/login', '/api/login'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Assets statiques et API (pas besoin d'auth)
  const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/api');
  
  if (isPublicPath || isStaticAsset) {
    return NextResponse.next();
  }
  
  // Verifier le cookie d'authentification
  const authCookie = request.cookies.get('auth');
  
  if (!authCookie || authCookie.value !== '1') {
    // Rediriger vers login si pas authentifie
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.).*)'],
};