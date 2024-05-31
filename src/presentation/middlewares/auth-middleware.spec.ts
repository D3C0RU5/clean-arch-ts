import { HttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'

describe('Auth Middleware', () => {
  test('Return 403 if no x-access-token exists in headers', async () => {
    const sut = new AuthMiddleware()
    const response = await sut.handle({})

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
