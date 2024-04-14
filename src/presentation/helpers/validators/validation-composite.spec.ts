import { MissingParamError } from '../../errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error | null {
    return new MissingParamError('field')
  }
}

describe('Validation Composite', () => {
  it('Return an Error if any validation fails', () => {
    // Arrange
    const validationStub = new ValidationStub()
    const sut = new ValidationComposite([validationStub])

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(new MissingParamError('field'))
  })
})
