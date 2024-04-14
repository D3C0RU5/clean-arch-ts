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
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: { password: 'any_password' },
    }

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
  it('Return 400 if no password is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: { email: 'any_email@mail.com' },
    }

    // Act
    const httpResponse = await sut.handle(httpRequest)

    // Assert
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
