import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation factory', () => {
  it('Call ValidationComposite with all validations', () => {
    // Act
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', makeEmailValidator()))

    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})