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
}
const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const sut = new LogControllerDecorator(controllerStub)

  return { controllerStub, sut }
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
    const { sut, controllerStub } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual({ statusCode: 200, body: { name: 'any_name' } })
  })
})
