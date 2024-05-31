import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    MongoHelper.connect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection?.deleteMany({})
  })

  afterAll(async () => {
    MongoHelper.disconnect()
  })

  type SutTypes = {
    sut: SurveyMongoRepository
  }
  const makeSut = (): SutTypes => {
    const sut = new SurveyMongoRepository()

    return { sut }
  }

  describe('Testing add', () => {
    it('Return void on add success', async () => {
      // Arrange
      const { sut } = makeSut()

      // Act
      await sut.add({
        question: 'any_question',
        answers: [
          {
            answer: 'any_answer',
            image: 'any_image',
          },
          {
            answer: 'other_answer',
          },
        ],
      })

      // Assert
      const survey = await surveyCollection.findOne({
        question: 'any_question',
      })

      expect(survey).toBeTruthy()
    })
  })
})
