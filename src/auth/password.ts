import { scrypt as scryptCallback, randomBytes } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify<string, string, number, Buffer>(scryptCallback)

export async function createPasswordHash(password: string) {
  // return bcrypt.hash(password, 10)
  const salt = randomBytes(16).toString('hex')
  const hash = await scrypt(password, salt, 32)
  return `${hash.toString('hex')}.${salt}`
}

export async function comparePasswordHash(password: string, hash: string) {
  // return bcrypt.compare(password, hash)
  const [hashedPassword, salt] = hash.split('.')
  const newHash = await scrypt(password, salt, 32)
  return hashedPassword === newHash.toString('hex')
}
