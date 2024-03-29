import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    MongoHelper.connect()
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  it('Return an account on success', async () => {
    // Arrange
    const sut = new AccountMongoRepository()

    // Act
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })

    // Assert
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account).toMatchObject({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })
})
