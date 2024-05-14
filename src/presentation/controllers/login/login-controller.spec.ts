import { MissingParamError } from '../../errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http/http-helper'
import { HttpRequest, Authentication } from './login-controller-protocols'
import { LoginController } from './login-controller'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { Validation } from '../../protocols'

const makeFakeRequest = (): HttpRequest => ({
  body: { email: 'any_email@mail.com', password: 'any_password' },
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string | null> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

type SutType = {
  sut: LoginController
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutType => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, validationStub, authenticationStub }
}

describe('Login Controller', () => {
  it('Call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  it('Return 401 if invalid credentials are provided', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))

    // Act
    const httpResponse = await sut.handle(makeFakeRequest())

    // Assert
    expect(httpResponse).toEqual(unauthorized())
  })

  it('Return 500 if invalid Authentication throws', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve, rejects) => rejects(new Error())),
      )

    // Act
    const httpResponse = await sut.handle(makeFakeRequest())

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Return 200 if valid credentials are provided', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const httpResponse = await sut.handle(makeFakeRequest())

    // Assert
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  it('Call Validation with correct values', async () => {
    // Arrange
    const { sut, validationStub } = makeSut()
    const httpRequest = makeFakeRequest()

    // Arrange(Mock)
    const validateSpy = jest.spyOn(validationStub, 'validate')

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('Return 400 if validation returns an error', async () => {
    // Arrange
    const { sut, validationStub } = makeSut()

    // Arrange (mock)
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
