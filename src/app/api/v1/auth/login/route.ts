import * as bcrypt from 'bcrypt'
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { LoginUserSchema } from '@/modules/auth/application/dtos/LoginUserDTO'

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const parsed = LoginUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { status: 404, message: 'User not found' },
        { status: 404 }
      )
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { status: 401, message: 'Invalid password' },
        { status: 401 }
      )
    }
    const JWT = await new SignJWT({
      userId: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('9h')
      .sign(new TextEncoder().encode(JWT_SECRET))

    const response = NextResponse.json(
      { status: 200, message: 'Login successful' },
      { status: 200 }
    )
    response.cookies.set('afsc_token', JWT, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 9,
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
