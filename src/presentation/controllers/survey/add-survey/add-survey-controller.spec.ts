import { HttpRequest, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{ image: 'any_string', answer: 'any_answer' }],
  },
})

describe('AddSurvey controller', () => {
  it('Should call validation with correct values', async () => {
    // Arrange
    class ValidationStub implements Validation {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validate(input: any): Error | null {
        return null
      }
    }
    const validationStub = new ValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const sut = new AddSurveyController(validationStub)
    const httpRequest = makeFakeRequest()

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
