import { AccountModel } from '../../../domain/models/account'
import {
  AddAccount,
  AddAccountModel,
} from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { HttpRequest } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'
import { SignUpController } from './signup'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

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
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  }
}

describe('SignUp Controller', () => {
  it('Return 400 if no name is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(badRequest(new MissingParamError('name')))
  })

  it('Return 400 if no email is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(badRequest(new MissingParamError('email')))
  })

  it('Return 400 if no password is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(badRequest(new MissingParamError('password')))
  })

  it('Return 400 if no passwordConfirmation is provided', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    )
  })

  it('Return 400 if password confirmation fails', async () => {
    // Arrange
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password',
      },
    }

    // Act
    const response = await sut.handle(httpRequest)

    // Assert
    expect(response).toEqual(
      badRequest(new InvalidParamError('passwordConfirmation')),
    )
  })

  it('Return 400 if an invalid email is provided', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()

    // Arrange (mock)
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(badRequest(new InvalidParamError('email')))
  })

  it('Call EmailValidator with correct email', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()

    // Arrange (mock)
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Return 500 if EmailValidator throws', async () => {
    // Arrange
    const { sut, emailValidatorStub } = makeSut()
    // Arrange (mock)
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(serverError())
  })

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
    expect(response).toEqual(serverError())
  })
  it('Return 200 if valid data is provided', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(ok(makeFakeAccount()))
  })
})
