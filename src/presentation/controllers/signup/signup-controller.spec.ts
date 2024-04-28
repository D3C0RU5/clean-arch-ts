import { AddAccountModel } from '../../../domain/usecases/add-account'
import { MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
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

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount()
  const validationStub = makeValidation()
  const sut = new SignUpController(addAccountStub, validationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
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
    expect(response).toEqual(ok(makeFakeAccount()))
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