export type SurveyAnswer = {
  image: string
  answer: string
}

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswer[]
}

export type AddSurvey = {
  add: (data: AddSurveyModel) => Promise<void>
}
