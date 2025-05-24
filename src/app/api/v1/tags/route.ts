import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'
import { verifyJWT } from '@/app/utils/jwt'
import { JWT_SECRET } from '@/app/utils/constants'
import { CreateTagSchema } from '@/modules/tag/application/dtos/CreateTagDTO'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = CreateTagSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const tag = parsed.data
    const createdTag = await prisma.tag.create({ data: tag })

    return NextResponse.json(
      { status: 201, message: 'Tag created sucessfully', data: createdTag },
      { status: 201 }
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
      requestedStatus === 'all' && hasValidJWT
        ? {}
        : requestedStatus === 'inactive' && hasValidJWT
        ? { active: false }
        : { active: true }

    const tags = await prisma.tag.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ status: 200, data: tags }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
