import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateProfileStatusTypeSchema = z.object({
  status: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const validationResult = CreateProfileStatusTypeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const profileStatus = validationResult.data
    const createdProfileStatus = await prisma.profileStatus.create({ data: profileStatus })

    return NextResponse.json(
      { status: 201, message: 'Asset type created', data: createdProfileStatus },
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
    const profileStatus = await prisma.profileStatus.findMany()

    return NextResponse.json({ status: 200, data: profileStatus }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
