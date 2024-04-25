import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  },
}))

const makeSut = () => {
  const sut = new EmailValidatorAdapter()

  return sut
}

describe('EmailValidator Adapter', () => {
  it('Return false if validator returns false', () => {
    // Arrange
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    // Act
    const isValid = sut.isValid('invalid_email@mail.com')

    // Assert
    expect(isValid).toBe(false)
  })

  it('Return true if validator returns true', () => {
    // Arrange
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(true)

    // Act
    const isValid = sut.isValid('valid_email@mail.com')

    // Assert
    expect(isValid).toBe(true)
  })

  it('Call validator with correct email', () => {
    // Arrange
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    // Act
    sut.isValid('valid_email@mail.com')

    // Assert
    expect(isEmailSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
