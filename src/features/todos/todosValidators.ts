import { z } from 'zod'

export const todoCreateSchema = z.object({
  title: z.string().min(2).max(100),
  desc: z.string().min(2).max(100),
  completed: z.boolean().optional(),
})
