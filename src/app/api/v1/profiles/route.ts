import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { z } from 'zod'
import { link } from 'fs'

const ITEMS_PER_PAGE = 10

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

const CreateProfileAssetSchema = z
  .object({
    file: z.instanceof(File).optional(),
    url: z.string().optional(),
    type: z.enum(Object.values(AssetType) as [string, ...string[]]),
  })
  .refine(
    (data) => {
      switch (data.type) {
        case AssetType.IMAGE:
        case AssetType.AUDIO:
          return !!data.file
        case AssetType.VIDEO:
          return !!data.url
        default:
          return false
      }
    },
    {
      message:
        'For image and audio, asset is required. For video, url is required.',
      path: ['asset', 'url'],
    }
  )

const CreateProfileRouteSchema = z.object({
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  orderNumber: z.number(),
})

const CreateProfileLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
})

const CreateProfileSchema = z
  .object({
    name: z.string(),
    story: z.string(),
    photo: z.instanceof(File).optional(),
    tagIds: z.array(z.number()),
    assets: z.array(CreateProfileAssetSchema).optional(),
    routes: z.array(CreateProfileRouteSchema).optional(),
    links: z.array(CreateProfileLinkSchema).optional(),
  })
  .refine(
    (data) => {
      if (data.photo) {
        return data.photo instanceof File && data.photo.size > 0
      }
      return true
    },
    {
      message: 'The photo field is sent but no file has been selected',
      path: ['photo'],
    }
  )

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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const body = parseNestedFormData(formData)

    if (body.tagIds) {
      body.tagIds = body.tagIds.map((id: string) => parseInt(id))
    }

    if (body.routes) {
      body.routes = body.routes.map((route: any) => ({
        ...route,
        orderNumber: parseInt(route.orderNumber, 10),
      }))
    }

    const validationResult = CreateProfileSchema.safeParse({
      ...body,
      photo: formData.get('photo'),
      tagIds: body.tagIds || [],
      assets: body.assets || [],
      routes: body.routes || [],
      links: body.links || [],
    })

    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, photo, story, tagIds, assets, routes, links } =
      validationResult.data

    let photoUrl = ''
    if (photo) {
      photoUrl = await uploadToS3(
        formData.get('photo') as File,
        'profile-photos'
      )
    }

    const uploadedAssets = await Promise.all(
      assets?.map(async (asset) => {
        if (asset.type === AssetType.IMAGE || asset.type === AssetType.AUDIO) {
          const file = asset.file as File
          if (file) {
            let uploadedUrl
            if (asset.type === AssetType.IMAGE) {
              uploadedUrl = await uploadToS3(file, 'images')
            }
            if (asset.type === AssetType.AUDIO) {
              uploadedUrl = await uploadToS3(file, 'audios')
            }

            return { url: uploadedUrl, typeId: AssetTypeIdMap[asset.type] }
          }
        }
        if (asset.type === AssetType.VIDEO) {
          return { url: asset.url, typeId: AssetTypeIdMap[asset.type] }
        }
      }) ?? []
    )

    const prisma = new PrismaClient()
    const createdProfile = await prisma.$transaction(async (prisma) => {
      const newProfile = await prisma.profile.create({
        data: {
          name,
          story,
          photo: photoUrl,
          ProfileTag: {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          },
          ProfileAsset: uploadedAssets?.length
            ? {
                create: uploadedAssets
                  .filter((asset) => asset?.url)
                  .map((asset) => ({
                    url: asset!.url!,
                    type: { connect: { id: asset!.typeId } },
                  })),
              }
            : undefined,
          ProfileRoute: routes?.length
            ? {
                create: routes.map((route) => ({
                  location: route.location,
                  latitude: route.latitude,
                  longitude: route.longitude,
                  orderNumber: route.orderNumber,
                })),
              }
            : undefined,
          ProfileLink: links?.length
            ? {
                create: links.map((link) => ({
                  title: link.title,
                  url: link.url,
                })),
              }
            : undefined,
        },
        include: {
          ProfileTag: { include: { tag: true } },
          ProfileAsset: true,
          ProfileRoute: true,
          ProfileLink: true,
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
      links: createdProfile.ProfileLink.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
      })),
    }

    return NextResponse.json(
      { status: 201, message: 'Profile created', data: transformedProfile },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
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
        ProfileLink: true,
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
      links: profile.ProfileLink.map((link) => ({
        id: link.id,
        title: link.title,
        url: link.url,
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
