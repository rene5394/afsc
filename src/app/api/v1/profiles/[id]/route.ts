import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { UpdateProfileSchema } from '@/modules/profile/application/dtos/UpdateProfileDTO'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.pathname.split('/')[4])
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        ProfileTag: {
          include: {
            tag: true,
          },
        },
        ProfileAsset: true,
        ProfileRoute: true,
        ProfileLink: true,
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
      author: profile.author,
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
      links: profile.ProfileLink.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
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
    const id = Number(req.nextUrl.pathname.split('/')[4])
    const profile = await prisma.profile.findUnique({
      where: { id },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = UpdateProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { tagIds, routes = [], ...profileData } = parsed.data

    const [currentTags, currentRoutes] = await Promise.all([
      prisma.profileTag.findMany({ where: { profileId: id } }),
      prisma.profileRoute.findMany({ where: { profileId: id } }),
    ])

    const currentTagIds = currentTags.map((profileTag) => profileTag.tagId)
    const tagsToAdd = tagIds.filter((tagId) => !currentTagIds.includes(tagId))
    const tagsToRemove = currentTagIds.filter(
      (tagId) => !tagIds.includes(tagId)
    )

    const currentRouteIds = currentRoutes.map((route) => route.id)
    const incomingRouteIds = (routes || [])
      .filter((route) => route.id !== 0)
      .map((route) => route.id!)
    const routesToAdd = (routes || []).filter((route) => route.id === 0)
    const routesToRemove = currentRouteIds.filter(
      (id) => !incomingRouteIds.includes(id)
    )
    const routesToUpdate = routes.filter((route) =>
      currentRouteIds.includes(route.id!)
    )

    const [, , , , updatedProfile] = await prisma.$transaction([
      ...tagsToRemove.map((tagId) =>
        prisma.profileTag.deleteMany({
          where: {
            profileId: id,
            tagId,
          },
        })
      ),
      ...tagsToAdd.map((tagId) =>
        prisma.profileTag.create({
          data: { profileId: id, tagId },
        })
      ),
      ...routesToRemove.map((routeId) =>
        prisma.profileRoute.delete({
          where: {
            id: routeId,
          },
        })
      ),
      ...routesToAdd.map((route) =>
        prisma.profileRoute.create({
          data: {
            profileId: id,
            location: route.location,
            latitude: route.latitude,
            longitude: route.longitude,
            orderNumber: route.orderNumber,
          },
        })
      ),
      ...routesToUpdate.map((route) =>
        prisma.profileRoute.update({
          where: { id: route.id },
          data: {
            location: route.location,
            latitude: route.latitude,
            longitude: route.longitude,
            orderNumber: route.orderNumber,
          },
        })
      ),
      prisma.profile.update({
        where: { id },
        data: profileData as any,
      }),
    ])

    return NextResponse.json(
      { status: 200, message: 'Profile updated', data: updatedProfile },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
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
