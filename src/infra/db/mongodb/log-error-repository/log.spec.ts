import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const makeSut = () => {
  const sut = new LogMongoRepository()

  return { sut }
}

describe('Log Mongo Repository', () => {
  let errorCollection: Collection
  beforeAll(async () => {
    MongoHelper.connect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection?.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  it('Create an error log on success', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    await sut.logError('any_error')

    // Assert
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
