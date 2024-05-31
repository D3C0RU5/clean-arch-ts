import { HttpRequest } from '../protocols'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  email: 'valid_email@mail.com',
  id: 'valid_id',
  name: 'valid_name',
  password: 'valid_password',
})

const makeFakeRequest = (): HttpRequest => ({
  headers: { 'x-access-token': 'any_token' },
})

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {
  test('Return 403 if no x-access-token exists in headers', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle({})

    // Assert
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Call LoadAccountByToken with correct accessToken', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut()

    // Mock
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    // Act
    await sut.handle(makeFakeRequest())

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })

  test('Return 403 if LoadAccountByToken returns null', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut()

    // Mock
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Return 200 if LoadAccountByToken returns a account', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Return 500 if LoadAccountByToken throws', async () => {
    // Arrange
    const { sut, loadAccountByTokenStub } = makeSut()

    // Mock
    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockRejectedValueOnce(new Error())

    // Act
    const response = await sut.handle(makeFakeRequest())

    // Assert
    expect(response).toEqual(serverError(new Error()))
  })
})
