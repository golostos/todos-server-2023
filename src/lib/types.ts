import { Role } from '@prisma/client'
import { ParamsDictionary } from 'express-serve-static-core'
import { Request } from 'express'

export type RequestUser = Request<
  ParamsDictionary,
  any,
  { user: { id: string; role: Role } }
>
