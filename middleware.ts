import { NextRequest, NextResponse } from 'next/server'
import {jwtDecode} from 'jwt-decode'

type JwtPayload = {
  exp: number
  [key: string]: any
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  let decoded: JwtPayload | null = null;
  let isExpired = false;

  if (token) {
    try {
      decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        isExpired = true;
      }
    } catch (err) {
      console.error('Invalid JWT:', err);
      isExpired = true;
    }
  }

  const redirectToLogin = () => {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
  };

  const isAuthPage = ['/', '/login', '/register'].includes(pathname);
  const isDashboardRoot = pathname === '/dashboard';
  const isEncryptPage = pathname === '/dashboard/encryptdecrypt';

  // === Token expired → hapus dan redirect login
  if (isExpired) {
    return redirectToLogin();
  }

  // === Jika user belum login dan akses /dashboard atau /dashboard/encryptdecrypt
  if (!decoded && (isDashboardRoot || isEncryptPage)) {
    return redirectToLogin();
  }

  // === Jika user sudah login dan akses halaman auth atau /dashboard root → redirect ke /dashboard/encryptdecrypt
  if (decoded && (isAuthPage || isDashboardRoot)) {
    return NextResponse.redirect(new URL('/dashboard/encryptdecrypt', request.url));
  }

  // === Semua aman, lanjutkan
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard', '/dashboard/encryptdecrypt'],
};
