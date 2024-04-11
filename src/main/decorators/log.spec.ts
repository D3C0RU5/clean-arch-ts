import {
  Controller,
  HttpRequest,
  HttpResponse,
} from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

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

describe('LogControllerDecorator', () => {
  it('Call controller handle', async () => {
    // Arrange
    const controllerStub = new ControllerStub()
    const sut = new LogControllerDecorator(controllerStub)
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    // Act
    await sut.handle(httpRequest)

    // Assert
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
