import '@/lib/initTestsEnv'
import { app } from '@/app'
import request from 'supertest'
import { parse } from 'cookie'
import { jwtVerify } from '@/auth'
import { clear, seed } from '../prisma/seed'

describe('users', () => {
  let userCookie: Record<string, string> = { token: '' }
  let adminCookie: Record<string, string> = { token: '' }
  beforeAll(async () => {
    await clear()
    await seed()
  })
  beforeAll(async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test1@mail.ru',
      password: 'admin123',
    })
    adminCookie = parse(res.headers['set-cookie'][0])
  })
  beforeAll(async () => {
    const res = await request(app).post('/api/users/login').send({
      email: 'test2@mail.ru',
      password: 'user123',
    })
    userCookie = parse(res.headers['set-cookie'][0])
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
  it('successful login user', async () => {
    expect(userCookie.token).toMatch(/^Bearer\s+.+$/)
    const token = userCookie.token.split(/\s+/)[1]
    const decoded = await jwtVerify(token, process.env.SECRET!)
    expect(decoded).toEqual({
      id: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
      role: 'USER',
    })
  })
  it('successful login admin', async () => {
    expect(adminCookie.token).toMatch(/^Bearer\s+.+$/)
    const token = adminCookie.token.split(/\s+/)[1]
    const decoded = await jwtVerify(token, process.env.SECRET!)
    expect(decoded).toEqual({
      id: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
      role: 'ADMIN',
    })
  })
  it('register user with correct credentials', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test15@mail.ru',
      password: 'user123',
    })
    expect(res.statusCode).toEqual(200)
    // expect cookie to be set with token
    const bearerToken = parse(res.headers['set-cookie'][0]).token
    expect(bearerToken).toMatch(/^Bearer\s+.+$/)
    // expect token to be valid
    const token = bearerToken.split(/\s+/)[1]
    const decoded = await jwtVerify(token, process.env.SECRET!)
    expect(decoded).toEqual({
      id: expect.any(String),
      exp: expect.any(Number),
      iat: expect.any(Number),
      role: 'USER',
    })
  })
  it('register user with exists email', async () => {
    const res = await request(app).post('/api/users/signup').send({
      email: 'test1@mail.ru',
      password: 'user123',
    })
    expect(res.statusCode).toEqual(409)
    expect(res.body).toEqual({ message: 'This email is already taken' })
  })
  it('get all users as user', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', `token=${userCookie.token}`)
    expect(res.statusCode).toEqual(403)
  })
  it('get all users as admin', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Cookie', `token=${adminCookie.token}`)
    expect(res.statusCode).toEqual(200)
  })
})
