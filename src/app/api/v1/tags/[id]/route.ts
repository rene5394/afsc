import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UpdateTagSchema } from '@/modules/tag/application/dtos/UpdateTagDTO'

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.pathname.split('/')[4])
    const tag = await prisma.tag.findUnique({ where: { id } })

    if (!tag) {
      return NextResponse.json(
        { status: 404, message: 'Tag not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = UpdateTagSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.errors },
        { status: 400 }
      )
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: parsed.data,
    })

    return NextResponse.json(
      { status: 200, message: 'Tag updated successfully', data: updatedTag },
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

    const tag = await prisma.tag.findUnique({ where: { id: Number(id) } })

    if (!tag) {
      return NextResponse.json(
        { status: 404, message: 'Tag not found' },
        { status: 404 }
      )
    }

    await prisma.tag.delete({ where: { id: Number(id) } })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
