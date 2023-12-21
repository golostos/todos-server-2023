import { userIds, todoIds } from './seedIds'
import db from '.'
import { createPasswordHash } from '@/lib/auth'

// ACID t-sql
// Atomicity: all or nothing
// Consistency: data is valid
// Isolation: concurrent transactions don't interfere
// Durability: data persists

export async function seed() {
  const users = db.user.createMany({
    data: [
      {
        id: userIds[0],
        email: 'test1@mail.ru',
        name: 'Admin',
        password: await createPasswordHash('admin123'),
        role: 'ADMIN',
      },
      {
        id: userIds[1],
        email: 'test2@mail.ru',
        name: 'User1',
        password: await createPasswordHash('user123'),
      },
      {
        id: userIds[2],
        email: 'test3@mail.ru',
        name: 'User2',
        password: await createPasswordHash('user123'),
      },
    ],
  })

  const todos = db.todo.createMany({
    data: todoIds.map((id, i) => ({
      id,
      title: `Todo ${i + 1}`,
      desc: `Content ${i + 1}`,
      userId: userIds[i % 3],
    })),
  })

  await db.$transaction([users, todos])
  await db.$disconnect()
}

export async function clear() {
  const deleteUsers = db.user.deleteMany()
  const deleteTodos = db.todo.deleteMany()
  await db.$transaction([deleteUsers, deleteTodos])
  await db.$disconnect()
}
