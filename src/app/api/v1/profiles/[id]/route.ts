import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { PatchProfileSchema } from '@/modules/profile/application/dtos/PatchProfileDTO'
import { UpdateProfileSchema } from '@/modules/profile/application/dtos/UpdateProfileDTO'
import { ProfileResponseDTO } from '@/modules/profile/application/dtos/ProfileResponseDTO'

enum AssetType {
  IMAGE = 'image',
  AUDIO = 'audio',
  VIDEO = 'video',
}
const AssetTypeIdMap = {
  [AssetType.IMAGE]: 1,
  [AssetType.AUDIO]: 2,
  [AssetType.VIDEO]: 3,
} as const

const prisma = new PrismaClient()

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

async function uploadToS3(file: File, folder: string) {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `${folder}/${Date.now()}_${file.name}`,
    Body: file.stream(),
    ContentType: file.type || 'application/octet-stream',
  }

  try {
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    })

    await upload.done()
    return `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`
  } catch (error) {
    console.error('Error uploading to S3:', error)
    throw new Error('Failed to upload to S3')
  }
}

function parseNestedFormData(formData: FormData) {
  const parsedData: Record<string, any> = {}

  formData.forEach((value, key) => {
    const keys = key.split(/\[|\]\[|\]/).filter(Boolean)
    let current = parsedData

    keys.forEach((part, index) => {
      if (index === keys.length - 1) {
        if (Array.isArray(current)) {
          current.push(value)
        } else {
          current[part] = value instanceof File ? value : value.toString()
        }
      } else {
        if (!current[part]) {
          current[part] = isNaN(Number(keys[index + 1])) ? {} : []
        }
        current = current[part]
      }
    })
  })

  return parsedData
}

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
      active: profile.active,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt ? profile.updatedAt.toISOString() : null,
    } as ProfileResponseDTO

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
      include: {
        ProfileAsset: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const formData = await req.formData()
    const body = parseNestedFormData(formData)

    if (body.tagIds) {
      body.tagIds = body.tagIds.map((id: string) => parseInt(id))
    }

    if (body.routes) {
      body.routes = body.routes.map((route: any) => ({
        ...route,
        id: parseInt(route.id, 10) || 0,
        orderNumber: parseInt(route.orderNumber, 10),
      }))
    }

    if (body.assets) {
      body.assets = body.assets.map((asset: any) => ({
        ...asset,
        id: parseInt(asset.id, 10),
      }))
    }

    const parsed = UpdateProfileSchema.safeParse({
      ...body,
      photo: formData.get('photo'),
      tagIds: body.tagIds || [],
      assets: body.assets || [],
      routes: body.routes || [],
      links: body.links || [],
    })

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    const { tagIds, assets = [], routes = [], ...profileData } = parsed.data

    if (parsed.data.photo instanceof File) {
      const file = parsed.data.photo as File
      const uploadedUrl = await uploadToS3(file, 'profile-photos')
      profileData.photo = uploadedUrl
    }

    const [currentTags, currentRoutes, currentAssets] = await Promise.all([
      prisma.profileTag.findMany({ where: { profileId: id } }),
      prisma.profileRoute.findMany({ where: { profileId: id } }),
      prisma.profileAsset.findMany({ where: { profileId: id } }),
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

    const currentAssetIds = currentAssets.map((asset) => asset.id)
    const incomingAssetIds = (assets || [])
      .filter((asset) => asset.id !== 0)
      .map((asset) => asset.id!)
    const assetsToAdd = (assets || []).filter((asset) => asset.id === 0)
    const assetsToRemove = currentAssetIds.filter(
      (id) => !incomingAssetIds.includes(id)
    )

    const uploadedAssets = await Promise.all(
      assetsToAdd.map(async (asset) => {
        if (asset.type === AssetType.IMAGE || asset.type === AssetType.AUDIO) {
          const file = asset.file as File
          const folder = asset.type === AssetType.IMAGE ? 'images' : 'audios'
          const uploadedUrl = await uploadToS3(file, folder)

          return {
            url: uploadedUrl,
            type: asset.type,
          }
        }

        if (asset.type === AssetType.VIDEO) {
          return {
            url: asset.url!,
            type: asset.type,
          }
        }

        throw new Error('Unknown asset type')
      })
    )

    const validAssets = uploadedAssets.map((asset) => ({
      url: asset.url,
      typeId: AssetTypeIdMap[asset.type as AssetType],
    }))

    const [, , , , , , , updatedProfile] = await prisma.$transaction([
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
      ...assetsToRemove.map((assetId) =>
        prisma.profileAsset.delete({
          where: {
            id: assetId,
          },
        })
      ),
      ...validAssets.map((asset) =>
        prisma.profileAsset.create({
          data: {
            profileId: id,
            url: asset.url,
            typeId: asset.typeId,
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

export async function PATCH(req: NextRequest) {
  try {
    const id = Number(req.nextUrl.pathname.split('/')[4])
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        ProfileAsset: true,
      },
    })

    if (!profile) {
      return NextResponse.json(
        { status: 404, message: 'Profile not found' },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = PatchProfileSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: parsed.error.format() },
        { status: 400 }
      )
    }

    console.log('Parsed data ci:', parsed.data)

    const { active } = parsed.data

    const patchedProfile = await prisma.profile.update({
      where: { id },
      data: { active },
    })

    console.log('Patched profile:', patchedProfile)

    return NextResponse.json(
      { status: 200, message: 'Profile patched', data: patchedProfile },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error patching profile:', error)
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
