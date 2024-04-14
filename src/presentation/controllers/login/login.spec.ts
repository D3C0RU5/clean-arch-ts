import { InvalidParamError, MissingParamError } from '../../errors'
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '../../helpers/http-helper'
import { HttpRequest, EmailValidator, Authentication } from './login-protocols'
import { LoginController } from './login'

const makeFakeRequest = (): HttpRequest => ({
  body: { email: 'any_email@mail.com', password: 'any_password' },
})

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(email: string, password: string): Promise<string | null> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

type SutType = {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutType => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return { sut, emailValidatorStub, authenticationStub }
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

  it('Call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Return 400 if invalid email isProvided', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // Act
    const httpResponse = await sut.handle(makeFakeRequest())

    // Assert
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Return 500 if invalid EmailValidator throws', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const httpResponse = await sut.handle(makeFakeRequest())

    // Assert
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Call Authentication with correct values', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
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
})
