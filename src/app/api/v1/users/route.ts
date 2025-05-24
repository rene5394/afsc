import * as bcrypt from 'bcrypt'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { verifyJWT } from '@/app/utils/jwt'
import { JWT_SECRET } from '@/app/utils/constants'
import { User } from '@/modules/user/domain/User'
import { CreateUserSchema } from '@/modules/user/application/dtos/CreateUserDTO'

const ITEMS_PER_PAGE = 10

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
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

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const page = parseInt(params.get('page') ?? '1')
    const skip = (page - 1) * ITEMS_PER_PAGE

    const statusParam = params.get('status')
    const requestedStatus =
      statusParam === 'inactive'
        ? 'inactive'
        : statusParam === 'all'
        ? 'all'
        : 'active'

    const cookieStore = cookies()
    const token = cookieStore.get('afsc_token')?.value
    let hasValidJWT = false

    if (token && JWT_SECRET) {
      try {
        const payload = await verifyJWT(token, JWT_SECRET)
        if (payload) {
          hasValidJWT = true
        }
      } catch (err) {
        hasValidJWT = false
      }
    }

    const whereClause =
      requestedStatus === 'all'
        ? {}
        : requestedStatus === 'inactive'
        ? { active: false }
        : { active: true }

    const totalUsers = await prisma.user.count({ where: whereClause })

    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: 'desc' },
    })

    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : null,
    }))

    const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)
    const nextPage = page < totalPages ? page + 1 : null
    const prevPage = page > 1 ? page - 1 : null

    return NextResponse.json(
      {
        status: 200,
        data: transformedUsers,
        meta: {
          total: totalUsers,
          totalPages,
          currentPage: page,
          nextPage,
          prevPage,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
