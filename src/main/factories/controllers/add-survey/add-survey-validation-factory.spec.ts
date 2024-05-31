import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '../../../../presentation/protocols'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation factory', () => {
  it('Call ValidationComposite with all validations', () => {
    // Act
    makeAddSurveyValidation()

    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    // Assert
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
