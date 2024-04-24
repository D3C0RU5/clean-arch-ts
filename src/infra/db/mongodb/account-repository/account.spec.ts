import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

const makeSut = () => {
  const sut = new AccountMongoRepository()

  return { sut }
}

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  describe('Testing add', () => {
    it('Return an account on add success', async () => {
      // Arrange
      const { sut } = makeSut()

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

  describe('Testing loadByEmail', () => {
    it('Return an account on loadByEmail success', async () => {
      // Arrange
      const { sut } = makeSut()
      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      })

      // Act
      const account = await sut.loadByEmail('any_email@mail.com')

      // Assert
      expect(account).toBeTruthy()
      expect(account?.id).toBeTruthy()
      expect(account).toMatchObject({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      })
    })
  })
})
