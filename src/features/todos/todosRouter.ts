import { Router } from 'express'
import db from '@/db'
import { querySchema } from '@/lib/genericValidators'
import { verifyToken } from '@/auth'
import { todoCreateSchema } from './todosValidators'

const todosRouter = Router()

todosRouter.get('/', verifyToken, async (req, res) => {
  const userId = req.body.user?.id
  const { limit, offset } = await querySchema.parseAsync(req.query)
  const todos = await db.todo.findMany({
    take: limit,
    skip: offset,
    where: {
      userId,
    },
  })
  res.json(todos)
})

todosRouter.post('/', verifyToken, async (req, res) => {
  const userId = req.body.user?.id
  const { desc, title, completed } = await todoCreateSchema.parseAsync(req.body)
  const todo = await db.todo.create({
    data: {
      desc,
      title,
      completed,
      userId,
    },
  })
  res.json(todo)
})

export default todosRouter
