import {
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const requiredFields: Validation[] = []
  for (const field of ['question', 'answers']) {
    requiredFields.push(new RequiredFieldValidation(field))
  }
  return new ValidationComposite(requiredFields)
}
