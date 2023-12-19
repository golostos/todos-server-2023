import { z } from 'zod'

export const querySchema = z.object({
  limit: z
    .string()
    .transform(val =>
      val && Number.isInteger(parseInt(val)) ? parseInt(val) : 20,
    )
    .optional(),
  offset: z
    .string()
    .transform(val =>
      val && Number.isInteger(parseInt(val)) ? parseInt(val) : 0,
    )
    .optional(),
})
