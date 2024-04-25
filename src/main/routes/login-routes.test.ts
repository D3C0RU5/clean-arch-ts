import request from 'supertest'
import bcrypt from 'bcrypt'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    MongoHelper.connect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection?.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    it('Return 200 on signup', async () => {
      // Act
      const response = await request(app).post('/api/signup').send({
        name: 'Taynara',
        email: 'taynarinha@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })

      // Assert
      expect(response.status).toBe(200)
    })
  })

  describe('POST /login', () => {
    it('Return 200 on signup', async () => {
      // Arrange
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Taynara',
        email: 'taynarinha@gmail.com',
        password: password,
      })

      // Act
      const response = await request(app).post('/api/login').send({
        email: 'taynarinha@gmail.com',
        password: '123',
      })

      // Assert
      expect(response.status).toBe(200)
    })

    it('Return 401 on signup', async () => {
      // Act
      const response = await request(app).post('/api/login').send({
        email: 'taynarinha@gmail.com',
        password: '123',
      })

      // Assert
      expect(response.status).toBe(401)
    })
  })
})
