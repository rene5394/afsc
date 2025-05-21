import { z } from 'zod'

export const CreateTagSchema = z.object({
  name: z.string(),
})

export type CreateTagDTO = z.infer<typeof CreateTagSchema>
