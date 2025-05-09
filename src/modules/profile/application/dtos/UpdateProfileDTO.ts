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

const RouteSchema = z.object({
  id: z.number().optional(),
  location: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  orderNumber: z.number(),
})

const AssetSchema = z
  .object({
    id: z.number().optional(),
    file: z.instanceof(File).optional(),
    url: z.string().optional(),
    type: z.enum(Object.values(AssetType) as [string, ...string[]]),
  })
  .refine(
    (data) => {
      switch (data.type) {
        case AssetType.IMAGE:
        case AssetType.AUDIO:
          return !!data.file || !!data.url
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

export const UpdateProfileSchema = z
  .object({
    name: z.string().optional(),
    author: z.string().optional(),
    story: z.string().optional(),
    photo: z.any().optional(),
    tagIds: z.array(z.number()),
    assets: z.array(AssetSchema).optional(),
    routes: z.array(RouteSchema).optional(),
  })
  .refine((data) => data.name !== undefined || data.photo !== undefined, {
    message: 'At least one of the fields must be provided',
    path: ['name', 'photo'],
  })
  .refine(
    (data) => {
      if (data.photo instanceof File) {
        return data.photo.size > 0
      }
      return true
    },
    {
      message: 'The photo field is sent but no file has been selected',
      path: ['photo'],
    }
  )

export type UpdateProfileDTO = z.infer<typeof UpdateProfileSchema>
export type RouteDTO = z.infer<typeof RouteSchema>
