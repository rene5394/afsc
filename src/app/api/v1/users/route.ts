import * as bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { CreateUserSchema } from '@/modules/user/application/dtos/CreateUserDTO'
import { User } from '@/modules/user/domain/User'

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const parsed = CreateUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { password, confirmPassword, ...userData } = parsed.data

    if (password !== confirmPassword) {
      return NextResponse.json({
        status: 400,
        body: {
          message: 'Passwords do not match',
        },
      })
    }

    const saltRounds = 10
    const hashPassword = bcrypt.hashSync(password, saltRounds)

    const createdUser = await prisma.user.create({
      data: { ...userData, password: hashPassword },
    })

    const transformedUser = {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      active: createdUser.active,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt ? createdUser.updatedAt : null,
    } as User

    return NextResponse.json(
      { status: 200, message: 'User created', data: transformedUser },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
