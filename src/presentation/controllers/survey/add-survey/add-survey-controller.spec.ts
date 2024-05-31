import {
  AddSurvey,
  AddSurveyModel,
  HttpRequest,
  Validation,
} from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import {
  badRequest,
  noContent,
  serverError,
} from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{ image: 'any_string', answer: 'any_answer' }],
  },
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error | null {
      return null
    }
  }

  return new ValidationStub()
}
const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async add(data: AddSurveyModel): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new AddSurveyStub()
}

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const addSurveyStub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub,
  }
}

describe('AddSurvey controller', () => {
  it('Call Validation with correct values', async () => {
    // Arrange
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()

    // Mock
    const validateSpy = jest.spyOn(validationStub, 'validate')

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Return 400 if Validation fails', async () => {
    // Arrange
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()

    // Mock
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(badRequest(new Error()))
  })

  it('Call AddSurvey with correct values', async () => {
    // Arrange
    const { sut, addSurveyStub } = makeSut()
    const httpRequest = makeFakeRequest()

    // Mock
    const addSpy = jest.spyOn(addSurveyStub, 'add')

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Return 500 if AddSurvey throws', async () => {
    // Arrange
    const { sut, addSurveyStub } = makeSut()

    // Mock
    jest.spyOn(addSurveyStub, 'add').mockRejectedValueOnce(new Error())

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(serverError(new Error()))
  })

  it('Return 204 on success', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(noContent())
  })
})
