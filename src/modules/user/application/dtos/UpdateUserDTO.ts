import { z } from 'zod'

export const UpdateUserSchema = z
  .object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.active !== undefined, {
    message:
      "At least one of the fields ('name', 'email' or 'active') is required.",
    path: ['name', 'email', 'active'],
  })

export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>
