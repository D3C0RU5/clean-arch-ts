import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
  CompareFieldsValidation,
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    requiredFields.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite([
    ...requiredFields,
    new CompareFieldsValidation('password', 'passwordConfirmation'),
    new EmailValidation('email', new EmailValidatorAdapter()),
  ])
}
