import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const UpdateRouteSchema = z
  .object({
    location: z.string().optional(),
    lang: z.string().optional(),
    height: z.string().optional(),
  })
  .refine(
    (data) =>
      data.location !== undefined ||
      data.lang !== undefined ||
      data.height !== undefined,
    {
      message: 'At least one of the fields must be provided',
      path: ['location', 'lang', 'height'],
    }
  )

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const id = req.nextUrl.pathname.split('/')[4]
    const route = await prisma.route.findUnique({ where: { id: Number(id) } })

    if (!route) {
      return NextResponse.json(
        { status: 404, message: 'Route not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ status: 200, data: route }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const id = req.nextUrl.pathname.split('/')[4]
    const route = await prisma.route.findUnique({ where: { id: Number(id) } })

    if (!route) {
      return NextResponse.json(
        { status: 404, message: 'Route not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validationResult = UpdateRouteSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const routeData = validationResult.data
    const updatedRoute = await prisma.route.update({
      where: { id: Number(id) },
      data: routeData as any,
    })

    return NextResponse.json(
      { status: 200, message: 'Route updated', data: updatedRoute },
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
    const route = await prisma.route.findUnique({ where: { id: Number(id) } })

    if (!route) {
      return NextResponse.json(
        { status: 404, message: 'Route not found' },
        { status: 404 }
      )
    }

    await prisma.route.delete({ where: { id: Number(id) } })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
