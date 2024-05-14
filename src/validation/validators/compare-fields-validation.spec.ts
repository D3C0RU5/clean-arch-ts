import { InvalidParamError } from '../../presentation/errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = () => {
  const sut = new CompareFieldsValidation('field', 'fieldToCompare')

  return { sut }
}

describe('CompareFields Validation', () => {
  it('Return a InvalidParamError if validation fails', () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'another_value',
    })

    // Assert
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('Return null if validation successeds', () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const error = sut.validate({
      field: 'same_value',
      fieldToCompare: 'same_value',
    })

    // Assert
    expect(error).toEqual(null)
  })
})
