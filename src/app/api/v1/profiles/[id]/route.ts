import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const UpdateProfileSchema = z
  .object({
    name: z.string().optional(),
    photo: z.string().optional(),
  })
  .refine((data) => data.name !== undefined || data.photo !== undefined, {
    message: 'At least one of the fields must be provided',
    path: ['name', 'photo'],
  })

export async function GET(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const id = req.nextUrl.pathname.split('/')[4]
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
      include: {
        ProfileTag: {
          include: {
            tag: true,
          },
        },
        ProfileAsset: true,
        ProfileRoute: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const transformedProfile = {
      id: profile.id,
      name: profile.name,
      photo: profile.photo,
      tags: profile.ProfileTag.map((profileTag) => ({
        id: profileTag.tag.id,
        name: profileTag.tag.name,
      })),
      assets: profile.ProfileAsset.map((asset) => ({
        id: asset.id,
        url: asset.url,
        typeId: asset.typeId,
      })),
      routes: profile.ProfileRoute.map((route) => ({
        id: route.id,
        location: route.location,
        latitude: route.latitude,
        longitude: route.longitude,
        orderNumber: route.orderNumber,
      })),
    }

    return NextResponse.json(
      { status: 200, data: transformedProfile },
      { status: 200 }
    )
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
    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validationResult = UpdateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const profileData = validationResult.data
    const updatedProfile = await prisma.profile.update({
      where: { id: Number(id) },
      data: profileData as any,
    })

    return NextResponse.json(
      { status: 200, message: 'Profile updated', data: updatedProfile },
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

    const profile = await prisma.profile.findUnique({
      where: { id: Number(id) },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    await prisma.profile.delete({ where: { id: Number(id) } })
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
