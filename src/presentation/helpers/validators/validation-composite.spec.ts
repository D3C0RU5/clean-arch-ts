import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error | null {
    return new MissingParamError('field')
  }
}

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
  validationStub: Validation
  sut: ValidationComposite
}
const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const sut = new ValidationComposite([validationStub])

  return { sut, validationStub }
}

describe('Validation Composite', () => {
  it('Return an Error if any validation fails', () => {
    // Arrange
    const { sut, validationStub } = makeSut()

    // Arrange (mock)
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(new MissingParamError('field'))
  })
})
