import { z } from 'zod'

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

const CreateProfileRouteSchema = z.object({
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  orderNumber: z.number(),
})

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

const CreateProfileLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
})

export const CreateProfileSchema = z
  .object({
    name: z.string(),
    author: z.string().optional(),
    story: z.string().optional(),
    photo: z.union([z.instanceof(File), z.string(), z.null(), z.undefined()]),
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

export type CreateProfileDTO = z.infer<typeof CreateProfileSchema>
