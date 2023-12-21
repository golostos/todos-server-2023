import '@/lib/initTestsEnv'
import { app } from '@/app'
import { seed, clear } from '@/db/dbData'
import request from 'supertest'

describe('users', () => {
  beforeAll(async () => {
    await clear()
    await seed()
  })
  it('login user with correct credentials', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test1@mail.ru',
      password: 'admin123',
    })
    expect(res.statusCode).toEqual(200)
  })
  it('login user with incorrect credentials', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test12@mail.ru',
      password: 'admin12345',
    })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Unauthorized' })
  })
  it('login user with incorrect email', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test12@mail.ru',
      password: 'user123',
    })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Unauthorized' })
  })
  it('login user with incorrect password', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test1@mail.ru',
      password: 'admin12345',
    })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toEqual({ message: 'Unauthorized' })
  })
})
