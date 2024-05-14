import { InvalidParamError } from '../../presentation/errors'
import { EmailValidator } from '../protocols/email-validator'
import { EmailValidation } from './email-validation'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type SutTypes = {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub,
  }
}

describe('Email Validation', () => {
  it('Return an error if Emailvalidator is false', () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()

    // Arrange (mock)
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // Act
    const error = sut.validate({ email: 'any_email@mail.com' })

    // Assert
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('Call EmailValidator with correct email', () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()

    // Arrange (mock)
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    // Act
    sut.validate({ email: 'any_email@mail.com' })

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Throw if EmailValidator throws', () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()
    // Arrange (mock)
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    // Assert
    expect(sut.validate).toThrow()
  })
})
