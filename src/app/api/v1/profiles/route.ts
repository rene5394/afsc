import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateProfileAssetSchema = z.object({
  url: z.string().url(),
  typeId: z.number(),
})

const CreateProfileRouteSchema = z.object({
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  orderNumber: z.number(),
})

const CreateProfileSchema = z.object({
  name: z.string(),
  photo: z.string().optional(),
  statusId: z.number(),
  tagIds: z.array(z.number()),
  assets: z.array(CreateProfileAssetSchema).optional(),
  routes: z.array(CreateProfileRouteSchema).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const prisma = new PrismaClient()
    const body = await req.json()
    const validationResult = CreateProfileSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const profile = validationResult.data
    const { name, photo, statusId, tagIds, assets, routes } = profile

    const createdProfile = await prisma.$transaction(async (prisma) => {
      const newProfile = await prisma.profile.create({
        data: {
          name,
          photo,
          statusId,
          ProfileTag: {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          },
          ProfileAsset: assets ? {
            create: assets.map((asset) => ({
              url: asset.url,
              typeId: asset.typeId,
            })),
          } : undefined,
          ProfileRoute: routes ? {
            create: routes.map((route) => ({
              location: route.location,
              latitude: route.latitude,
              longitude: route.longitude,
              orderNumber: route.orderNumber,
            })),
          } : undefined,
        },
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

      return newProfile
    })

    const transformedProfile = {
      id: createdProfile.id,
      name: createdProfile.name,
      photo: createdProfile.photo,
      statusId: createdProfile.statusId,
      tags: createdProfile.ProfileTag.map((profileTag) => ({
        id: profileTag.tag.id,
        name: profileTag.tag.name,
      })),
      assets: createdProfile.ProfileAsset.map((asset) => ({
        id: asset.id,
        url: asset.url,
        typeId: asset.typeId,
      })),
      routes: createdProfile.ProfileRoute.map((route) => ({
        id: route.id,
        location: route.location,
        latitude: route.latitude,
        longitude: route.longitude,
        orderNumber: route.orderNumber,
      })),
    }

    return NextResponse.json(
      { status: 201, message: 'Profile created', data: transformedProfile },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const prisma = new PrismaClient()
    const profiles = await prisma.profile.findMany({
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

    const transformedProfiles = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      photo: profile.photo,
      statusId: profile.statusId,
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
    }))

    return NextResponse.json(
      { status: 200, data: transformedProfiles },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
