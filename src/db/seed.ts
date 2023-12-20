import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { userIds, todoIds } from './seedIds'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      id: userIds[0],
      email: 'test1@mail.ru',
      name: 'Admin',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
    },
  })

  await prisma.user.create({
    data: {
      id: userIds[1],
      email: 'test2@mail.ru',
      name: 'User1',
      password: bcrypt.hashSync('user123', 10),
    },
  })

  await prisma.user.create({
    data: {
      id: userIds[2],
      email: 'test3@mail.ru',
      name: 'User2',
      password: bcrypt.hashSync('user123', 10),
    },
  })

  const todos = []

  for (let i = 0; i < todoIds.length; i++) {
    const todo = prisma.todo.create({
      data: {
        id: todoIds[i],
        title: `Todo ${i + 1}`,
        desc: `Content ${i + 1}`,
        User: {
          connect: {
            id: userIds[i % 3],
          },
        },
      },
    })
    todos.push(todo)
  }

  await Promise.all(todos)
}

main()
  .then(() => console.log('Seeding complete'))
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
