import { HttpRequest } from '../protocols'
import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'any_password',
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
    const response = await sut.handle({})

    // Assert
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
})
