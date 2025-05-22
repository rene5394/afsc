import { z } from 'zod'

export const PatchProfileSchema = z.object({
  active: z.boolean().optional(),
})

export type PatchProfileDTO = z.infer<typeof PatchProfileSchema>
