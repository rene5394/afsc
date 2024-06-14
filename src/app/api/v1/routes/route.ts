import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateRouteSchema = z.object({
  location: z.string(),
  lang: z.string(),
  height: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const validationResult = CreateRouteSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const route = validationResult.data
    const createdRoute = await prisma.route.create({ data: route })

    return NextResponse.json(
      { status: 201, message: 'Tag created', data: createdRoute },
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
    const routes = await prisma.route.findMany()

    return NextResponse.json({ status: 200, data: routes }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
