import { Prisma } from '@prisma/client'
import { ErrorRequestHandler } from 'express'
import { HttpError } from 'http-errors'
import { ZodError } from 'zod'

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  console.log(err)
  if (err instanceof ZodError) {
    return res.status(400).json({ message: err.message })
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message })
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(400).json({
        message: `This ${
          Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field'
        } is already taken`,
      })
    }
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: err.message })
    }
    return res.sendStatus(500)
  }
  if (err instanceof Error) {
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).json({ message: err.message })
    }
  }
  res.sendStatus(500)
}

export default errorHandler
