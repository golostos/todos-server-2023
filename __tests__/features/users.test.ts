import '../initTestsEnv'
import { app } from '@/app'
import request from 'supertest'
import { parse } from 'cookie'
import { jwtVerify } from '@/auth'
import { clear, seed } from '@db/seed'
import { userIds } from '@db/seed/seedIds'

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

  describe('Login user', () => {
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
  })

  describe('Register user', () => {
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
  })

  describe('Get users', () => {
    it('get all users without token', async () => {
      const res = await request(app).get('/api/users')
      expect(res.statusCode).toEqual(401)
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
    it('get user by id as user', async () => {
      const res = await request(app)
        .get('/api/users/' + userIds[1])
        .set('Cookie', `token=${userCookie.token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body?.id).toEqual(userIds[1])
      expect(res.body?.password).toBeUndefined()
      expect(res.body?.role).toEqual('USER')
    })
    it('get user by id as admin', async () => {
      const res = await request(app)
        .get('/api/users/' + userIds[1])
        .set('Cookie', `token=${adminCookie.token}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body?.id).toEqual(userIds[1])
      expect(res.body?.password).toBeUndefined()
      expect(res.body?.role).toEqual('USER')
    })
    it('get user by id as another user', async () => {
      const res = await request(app)
        .get('/api/users/' + userIds[2])
        .set('Cookie', `token=${userCookie.token}`)
      expect(res.statusCode).toEqual(403)
    })
  })

  describe('Create user', () => {
    it('create user as user', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Cookie', `token=${userCookie.token}`)
        .send({
          email: 'test4@mail.ru',
          password: 'user123',
        })
      expect(res.statusCode).toEqual(403)
    })
    it('create user as admin', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Cookie', `token=${adminCookie.token}`)
        .send({
          email: 'test4@mail.ru',
          password: 'user123',
          role: 'USER',
          name: 'User4',
        })
      expect(res.statusCode).toEqual(200)
      expect(res.body?.id).toEqual(expect.any(String))
      expect(res.body?.password).toBeUndefined()
      expect(res.body?.role).toEqual('USER')
    })
  })

  describe('Update user', () => {
    it('update user as another user', async () => {
      const res = await request(app)
        .patch('/api/users/' + userIds[2])
        .set('Cookie', `token=${userCookie.token}`)
        .send({
          name: 'User2',
        })
      expect(res.statusCode).toEqual(403)
    })
    it('update user as user', async () => {
      const res = await request(app)
        .patch('/api/users/' + userIds[1])
        .set('Cookie', `token=${userCookie.token}`)
        .send({
          name: 'User1',
        })
      expect(res.statusCode).toEqual(200)
    })
    it('update user as admin', async () => {
      const res = await request(app)
        .patch('/api/users/' + userIds[2])
        .set('Cookie', `token=${adminCookie.token}`)
        .send({
          name: 'User2',
        })
      expect(res.statusCode).toEqual(200)
    })
  })

  describe('Delete user', () => {
    it('delete user as another user', async () => {
      const res = await request(app)
        .delete('/api/users/' + userIds[2])
        .set('Cookie', `token=${userCookie.token}`)
      expect(res.statusCode).toEqual(403)
    })
    it('delete user as user', async () => {
      const res = await request(app)
        .delete('/api/users/' + userIds[1])
        .set('Cookie', `token=${userCookie.token}`)
      expect(res.statusCode).toEqual(200)
    })
    it('delete user as admin', async () => {
      const res = await request(app)
        .delete('/api/users/' + userIds[2])
        .set('Cookie', `token=${adminCookie.token}`)
      expect(res.statusCode).toEqual(200)
    })
  })
})
