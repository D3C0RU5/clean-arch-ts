import { LogErrorRepository } from '../../data/protocols/log-error-repository'
import { serverError } from '../../presentation/helpers/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'any_name',
        },
      }
      return new Promise(resolve => resolve(httpResponse))
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password',
    },
  }
}

type SutTypes = {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return { controllerStub, sut, logErrorRepositoryStub }
}

describe('LogControllerDecorator', () => {
  it('Call controller handle', async () => {
    // Arrange
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  it('Return the same result of the controller', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual({ statusCode: 200, body: { name: 'any_name' } })
  })

  it('Call LogErrorRepository with correct error if controller returns a server error', async () => {
    // Arrange
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakerError = new Error()
    fakerError.stack = 'any_stack'
    const error = serverError(fakerError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise(resolve => resolve(error)))

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
