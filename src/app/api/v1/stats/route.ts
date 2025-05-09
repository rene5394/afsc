import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const [profileCount, tagCount] = await Promise.all([
    prisma.profile.count(),
    prisma.tag.count(),
  ])

  return NextResponse.json(
    { status: 200, data: { profileCount, tagCount } },
    { status: 200 }
  )
}
