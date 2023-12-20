import express from 'express'
import 'express-async-errors'
import cookieParser from 'cookie-parser'
import usersRouter from './features/users/usersRouter'
import errorHandler from './lib/errorHandler'

export const app = express()
app.use(cookieParser())
app.use(express.json())

app.use('/api/users', usersRouter)

app.use(errorHandler)
