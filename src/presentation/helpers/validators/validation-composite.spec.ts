import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
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
  validationStubs: Validation[]
  sut: ValidationComposite
}
const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  it('Return an Error if any validation fails', () => {
    // Arrange
    const { sut, validationStubs } = makeSut()

    // Arrange (mock)
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'))

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Return the first error if more than one validation fails', () => {
    // Arrange
    const { sut, validationStubs } = makeSut()

    // Arrange (mock)
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('second_error'))

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(new Error())
  })

  it('Return null if all validations succeeds', () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(null)
  })
})
