import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  for (const field of ['email', 'password']) {
    requiredFields.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite([
    ...requiredFields,
    new EmailValidation('email', new EmailValidatorAdapter()),
  ])
}
