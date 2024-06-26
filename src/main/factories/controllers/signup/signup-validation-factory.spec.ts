import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
} from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

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
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    )
    validations.push(new EmailValidation('email', makeEmailValidator()))

    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
