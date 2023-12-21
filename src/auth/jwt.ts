import jwt from 'jsonwebtoken'
import { promisify } from 'util'

export default jwt

export const jwtVerify = promisify<
  string,
  string,
  string | jwt.JwtPayload | undefined
>(jwt.verify)
