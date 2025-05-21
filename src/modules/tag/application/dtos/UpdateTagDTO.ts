import { z } from 'zod'

export const UpdateTagSchema = z
  .object({
    name: z.string().optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.active !== undefined, {
    message: "At least one of the fields ('name' or 'active') is required.",
    path: ['name', 'active'],
  })

export type UpdateTagDTO = z.infer<typeof UpdateTagSchema>
