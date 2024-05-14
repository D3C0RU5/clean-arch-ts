import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

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
