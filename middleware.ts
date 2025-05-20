import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

type JwtPayload = {
  exp: number
  [key: string]: any
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  let decoded: JwtPayload | null = null
  let isExpired = false 

  if (token) {
    try {
      decoded = jwtDecode<JwtPayload>(token)
      const now = Math.floor(Date.now() / 1000)
      if (decoded.exp && decoded.exp < now) {
        isExpired = true
      }
    } catch (err) {
      console.error('Invalid JWT:', err)
      isExpired = true
    }
  }

  const redirectToLogin = () => {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.set('token', '', { maxAge: 0 })
    return response
  }

  // === Jika akses ke `/` dan belum punya token → redirect ke /login
  if (pathname === '/' && !decoded) {
    return redirectToLogin()
  }

  // === Token expired → hapus dan redirect login
  if (isExpired) {
    return redirectToLogin()
  }

  const isAuthPage = ['/login', '/register'].includes(pathname)
  const isDashboardRoot = pathname === '/dashboard'
  const isEncryptPage = pathname === '/dashboard/encryptdecrypt'
  const isAdmin = pathname === '/dashboard/admin'

  // === Jika belum login dan akses dashboard → redirect login
  if (!decoded && (isDashboardRoot || isAdmin ||isEncryptPage)) {
    return redirectToLogin()
  }

  // === Jika sudah login dan akses login/register/dashboard root → redirect ke encryptdecrypt/admin
  if (decoded && (isAuthPage || isDashboardRoot || pathname === '/')) {
    if (decoded.role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    } else {
      return NextResponse.redirect(new URL('/dashboard/encryptdecrypt', request.url))
    }
  }

  // === Jika admin akses /dashboard/encryptdecrypt, redirect ke /dashboard/admin
  if (decoded && pathname === '/dashboard/encryptdecrypt' && decoded.role === 'admin') {
    return NextResponse.redirect(new URL('/dashboard/admin', request.url))
  }

  // === Semua aman, lanjutkan
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/register', '/dashboard', '/dashboard/encryptdecrypt', '/dashboard/admin'],
}
