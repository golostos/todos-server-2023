import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token
  if (typeof token === 'string') {
    // bearerToken = 'Bearer ' + token
    const bearerToken = token.split(' ')[1]
    jwt.verify(bearerToken, process.env.SECRET!, async (err, data) => {
      if (!data || typeof data !== 'object') {
        return res.sendStatus(403)
      }
      if (err) {
        return res.sendStatus(403)
      }
      req.body.user = {
        id: data.id,
        role: data.role,
      }
      next()
    })
  } else {
    res.sendStatus(403)
  }
}

export function createToken(data: object) {
  return jwt.sign(data, process.env.SECRET!, { expiresIn: '1d' })
}

export function deleteToken(req: Request, res: Response) {
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

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.body.user.role !== 'ADMIN') {
    return res.sendStatus(403)
  }
  next()
}

export function isSelf(req: Request, res: Response, next: NextFunction) {
  const id = req.params.id
  if (typeof id !== 'string') {
    return res.sendStatus(400)
  }
  if (req.body.user.id !== id && req.body.user.role !== 'ADMIN') {
    return res.sendStatus(403)
  }
  next()
}

export function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePasswordHash(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}
