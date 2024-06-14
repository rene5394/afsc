import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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
