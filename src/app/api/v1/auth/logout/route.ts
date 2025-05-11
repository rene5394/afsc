import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  const response = NextResponse.json(
    { status: 200, message: 'Logout successful' },
    { status: 200 }
  )

  response.cookies.set('afsc_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  return response
}
