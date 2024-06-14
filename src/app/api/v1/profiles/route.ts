import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const CreateProfileSchema = z.object({
  name: z.string(),
  photo: z.string().optional(),
  statusId: z.number(),
  tagIds: z.array(z.number()),
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
    const { name, photo, statusId, tagIds } = profile
    //const createdProfile = await prisma.profile.create({ data: profile })

    const createdProfile = await prisma.$transaction(async (prisma) => {
      const createdProfile = await prisma.profile.create({
        data: {
          name,
          photo,
          statusId,
        },
      })

      const profileTags = tagIds.map((tagId) => ({
        profileId: createdProfile.id,
        tagId,
      }))

      await prisma.profileTag.createMany({
        data: profileTags,
      })

      return createdProfile
    })

    return NextResponse.json(
      { status: 201, message: 'Profile created', data: createdProfile },
      { status: 201 }
    )
  } catch (error) {
    console.log('ERROR', error)
    return NextResponse.json(
      { status: 500, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    console.log('PARAMS', params)
    const prisma = new PrismaClient()
    const profiles = await prisma.profile.findMany({
      include: {
        ProfileTag: {
          include: {
            tag: true,
          },
        },
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
