import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/app/utils/jwt'
import { APP_URL, JWT_SECRET } from '@/app/utils/constants'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const method = request.method
  const jwt = request.cookies.get('afsc_token')?.value

  const isAuthPage = pathname === '/login'
  const isAdminRoot = pathname === '/admin'
  const isAdminPath = pathname.startsWith('/admin')
  const isApiPath = pathname.startsWith('/api')
  const isApiAuthLogin = pathname === '/api/v1/auth/login'

  if (isAuthPage) {
    if (jwt && JWT_SECRET) {
      const payload = await verifyJWT(jwt, JWT_SECRET)
      if (payload) {
        return NextResponse.redirect(`${APP_URL}/admin/dashboard`)
      }
    }

    return NextResponse.next()
  }

  if (isAdminRoot) {
    return NextResponse.redirect(`${APP_URL}/admin/dashboard`)
  }

  if (isAdminPath) {
    if (!JWT_SECRET) {
      return NextResponse.json(
        { status: 500, message: 'Internal Server Error' },
        { status: 500 }
      )
    }

    if (!jwt) {
      return NextResponse.redirect(`${APP_URL}/login`)
    }

    const payload = await verifyJWT(jwt, JWT_SECRET)

    if (!payload) {
      return NextResponse.redirect(`${APP_URL}/login`)
    }

    return NextResponse.next()
  }

  if (isApiAuthLogin) {
    return NextResponse.next()
  }

  if (isApiPath && method !== 'GET') {
    if (!JWT_SECRET) {
      return NextResponse.json(
        { status: 500, message: 'Internal Server Error' },
        { status: 500 }
      )
    }

    if (!jwt) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyJWT(jwt, JWT_SECRET)
    if (!payload) {
      return NextResponse.json(
        { status: 401, message: 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/admin/:path*', '/api/:path*'],
}
