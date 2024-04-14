import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = () => {
  const sut = new RequiredFieldValidation('field')

  return { sut }
}

describe('RequiredField Validation', () => {
  it('Return a MissingParamError if validation fails', () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const error = sut.validate({})

    // Assert
    expect(error).toEqual(new MissingParamError('field'))
  })

  it('Return null if validation successeds', () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const error = sut.validate({ field: 'any_value' })

    // Assert
    expect(error).toEqual(null)
  })
})
