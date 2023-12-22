import { config } from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import { join } from 'path'

const myEnv = config({ path: join(process.cwd(), '.env.test') })
dotenvExpand.expand(myEnv)
