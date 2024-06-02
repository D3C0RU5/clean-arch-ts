import { Decrypter } from '../../protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password',
})

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('decrypted_value'))
    }
  }

  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements LoadAccountByTokenRepository
  {
    async loadByToken(
      token: string,
      role?: string,
    ): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub,
  )

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken Usecase ', () => {
  test('Call LoadAccountByTokenRepository with correct values', async () => {
    // Arrange
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    // Mock
    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken',
    )

    // Act
    await sut.load('any_token', 'any_role')

    // Assert
    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Call Decrypter with correct values', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut()

    // Mock
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    // Act
    await sut.load('any_token', 'any_role')

    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Return null if Decrypter returns null', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut()

    // Mock
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    // Act
    const result = await sut.load('any_token', 'any_role')

    // Assert
    expect(result).toBe(null)
  })
})
