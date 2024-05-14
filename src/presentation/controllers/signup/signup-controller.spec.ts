import { AddAccountModel } from '../../../domain/usecases/add-account'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { Authentication } from '../login/login-controller-protocols'
import { SignUpController } from './signup-controller'
import {
  HttpRequest,
  AddAccount,
  AccountModel,
} from './signup-controller-protocols'

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => {
        resolve(makeFakeAccount())
      })
    }
  }
  return new AddAccountStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeFakeAccount = (): AccountModel => {
  return {
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password',
  }
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

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string | null> {
      return new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  )

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  }
}

describe('SignUp Controller', () => {
  it('Call AddAccount with correct values', async () => {
    // Arrange
    const { sut, addAccountStub } = makeSut()

    // Arrange(Mock)
    const addSpy = jest.spyOn(addAccountStub, 'add')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  it('Return 500 if AddAccount throws', async () => {
    // Arrange
    const { sut, addAccountStub } = makeSut()

    // Arrange(Mock)
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(serverError(null))
  })

  it('Return 200 if valid data is provided', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(ok({ accessToken: 'any_token' }))
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

  it('Return 500 if Authentication throws', async () => {
    // Arrange
    const { sut, authenticationStub } = makeSut()

    // Arrange(Mock)
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(serverError(new Error()))
  })
})
