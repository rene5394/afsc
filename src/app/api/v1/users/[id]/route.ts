import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UpdateUserSchema } from '@/modules/user/application/dtos/UpdateUserDTO'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.pathname.split('/')[4])
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
      return NextResponse.json(
        { status: 404, message: 'User not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = UpdateUserSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(
      { status: 200, message: 'User updated successfully', data: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const id = req.nextUrl.pathname.split('/')[4]

    const user = await prisma.user.findUnique({ where: { id: Number(id) } })

    if (!user) {
      return NextResponse.json(
        { status: 404, message: 'Tag not found' },
        { status: 404 }
      )
    }

    await prisma.user.delete({ where: { id: Number(id) } })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
