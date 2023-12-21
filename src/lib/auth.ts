import { NextFunction, Response } from 'express'
import bcrypt from 'bcrypt'
import { uuidSchema } from './genericValidators'
import createHttpError from 'http-errors'
import { RequestUser } from './types'
import jwt, { jwtVerify } from './jwt'

export async function verifyToken(
  req: RequestUser,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.token
  if (typeof token === 'string') {
    // bearerToken = 'Bearer ' + token
    try {
      const bearerToken = token.split(' ')[1]
      const data = await jwtVerify(bearerToken, process.env.SECRET!)
      if (!data || typeof data !== 'object') {
        // return res.sendStatus(401)
        throw new createHttpError.Unauthorized()
      }
      req.body.user = {
        id: data.id,
        role: data.role,
      }
      next()
    } catch (error) {
      throw new createHttpError.Unauthorized()
    }
  } else {
    // res.sendStatus(401)
    throw new createHttpError.Unauthorized()
  }
}

export function createToken(data: object) {
  return jwt.sign(data, process.env.SECRET!, { expiresIn: '1d' })
}

export function deleteToken(req: RequestUser, res: Response) {
  res.clearCookie('token')
  res.sendStatus(200)
}

export function setToken(res: Response, data: object) {
  const token = createToken(data)
  res.cookie('token', `Bearer ${token}`, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  })
  res.sendStatus(200)
}

export function isAdmin(req: RequestUser, res: Response, next: NextFunction) {
  if (req.body.user.role !== 'ADMIN') {
    // return res.sendStatus(403)
    throw new createHttpError.Forbidden()
  }
  next()
}

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

export function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
