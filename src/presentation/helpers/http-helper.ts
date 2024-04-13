import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
})

export const serverError = (error: unknown): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error instanceof Error ? error.stack : undefined),
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data,
})
