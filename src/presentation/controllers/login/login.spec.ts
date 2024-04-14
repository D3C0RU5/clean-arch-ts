import { MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

type SutType = {
  sut: LoginController
}

const makeSut = (): SutType => {
  const sut = new LoginController()
  return { sut }
}

describe('Login Controller', () => {
  it('Return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: { password: 'any_password' },
    }

    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
