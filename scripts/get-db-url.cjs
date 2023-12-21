/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const { join } = require('path')

const myEnv = dotenv.config({ path: join(__dirname, '../.env.test') })
// Expand the environment variables, replacing any variables with process.env.VAR_NAME if they exist
// i.e. if you have a variable called DATABASE_URL
// DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
// and you have POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB set in your environment
// then DATABASE_URL will be expanded to the correct value
// example result: postgresql://postgres:postgres@localhost:5432/postgres?schema=public
dotenvExpand.expand(myEnv)

const { DATABASE_URL } = process.env

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

// return DATABASE_URL to the IO
console.log(DATABASE_URL)
