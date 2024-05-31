export type SurveyAnswer = {
  answer: string
  image?: string
}

export type AddSurveyModel = {
  question: string
  answers: SurveyAnswer[]
}

export type AddSurvey = {
  add: (data: AddSurveyModel) => Promise<void>
}
