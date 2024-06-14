import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateTagSchema = z.object({
  name: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const validationResult = CreateTagSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const tag = validationResult.data
    const createdTag = await prisma.tag.create({ data: tag })

    return NextResponse.json(
      { status: 201, message: 'Tag created', data: createdTag },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const prisma = new PrismaClient()
    const tags = await prisma.tag.findMany()

    return NextResponse.json({ status: 200, data: tags }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
