import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
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
