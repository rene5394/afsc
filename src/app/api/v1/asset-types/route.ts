import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateAssetTypeSchema = z.object({
  type: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const validationResult = CreateAssetTypeSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const assetType = validationResult.data
    const createdAssetType = await prisma.assetType.create({ data: assetType })

    return NextResponse.json(
      { status: 201, message: 'Asset type created', data: createdAssetType },
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
    const assetTypes = await prisma.assetType.findMany()

    return NextResponse.json({ status: 200, data: assetTypes }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
