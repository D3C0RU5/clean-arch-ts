import { AddSurveyModel } from '../../../../domain/usecases/add-survey'

export type AddSurveyRepository = {
  add(surveyData: AddSurveyModel): Promise<void>
}
