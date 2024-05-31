import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

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

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub,
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
})
