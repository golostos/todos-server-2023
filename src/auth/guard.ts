import db from '@/db'
import { uuidSchema } from '@/lib/genericValidators'
import { RequestUser } from '@/lib/types'
import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'

export async function isSelf(
  req: RequestUser,
  res: Response,
  next: NextFunction,
) {
  const id = await uuidSchema.parseAsync(req.params.id)
  if (req.body?.user?.id !== id && req.body?.user?.role !== 'ADMIN') {
    // return res.sendStatus(403)
    throw new createHttpError.Forbidden()
  }
  next()
}

export async function isSelfTodo(
  req: RequestUser,
  res: Response,
  next: NextFunction,
) {
  if (req.body?.user?.role === 'ADMIN') {
    return next()
  }
  const id = await uuidSchema.parseAsync(req.params.id)
  const userId = req.body.user?.id
  const todo = await db.todo.findMany({
    where: {
      userId,
      id,
    },
  })
  if (todo) return next()
  // return res.sendStatus(403)
  throw new createHttpError.Forbidden()
}
