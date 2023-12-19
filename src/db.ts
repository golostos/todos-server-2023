import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
  log: ['query', 'info', 'warn'],
})

export default db
