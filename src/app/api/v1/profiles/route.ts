import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const ITEMS_PER_PAGE = 10

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
  story: z.string(),
  photo: z.string().optional(),
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
    const { name, story, photo, tagIds, assets, routes } = profile

    const createdProfile = await prisma.$transaction(async (prisma) => {
      const newProfile = await prisma.profile.create({
        data: {
          name,
          story,
          photo,
          ProfileTag: {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          },
          ProfileAsset: assets
            ? {
                create: assets.map((asset) => ({
                  url: asset.url,
                  typeId: asset.typeId,
                })),
              }
            : undefined,
          ProfileRoute: routes
            ? {
                create: routes.map((route) => ({
                  location: route.location,
                  latitude: route.latitude,
                  longitude: route.longitude,
                  orderNumber: route.orderNumber,
                })),
              }
            : undefined,
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
      story: createdProfile.story,
      photo: createdProfile.photo,
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
    const page = parseInt(params.get('page') ?? '1')
    const skip = (page - 1) * ITEMS_PER_PAGE
    const prisma = new PrismaClient()

    const totalProfiles = await prisma.profile.count()

    const profiles = await prisma.profile.findMany({
      skip: skip,
      take: ITEMS_PER_PAGE,
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
      story: profile.story,
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
    }))

    const totalPages = Math.ceil(totalProfiles / ITEMS_PER_PAGE)
    const nextPage = page < totalPages ? page + 1 : null
    const prevPage = page > 1 ? page - 1 : null

    return NextResponse.json(
      {
        status: 200,
        data: transformedProfiles,
        meta: {
          total: totalProfiles,
          totalPages: totalPages,
          currentPage: page,
          nextPage: nextPage,
          prevPage: prevPage,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
