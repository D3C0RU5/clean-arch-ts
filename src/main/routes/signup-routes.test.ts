import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

describe('SignUp Routes', () => {
  beforeAll(async () => {
    MongoHelper.connect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('account')
    await accountCollection?.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  it('Return an account on success', async () => {
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
