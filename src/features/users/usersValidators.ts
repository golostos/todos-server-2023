import { z } from 'zod'

export const userCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
  name: z.string().min(2).max(100).optional(),
  role: z.enum(['ADMIN', 'USER']),
})

export const userUpdateSchema = userCreateSchema.partial()

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5).max(100),
})
