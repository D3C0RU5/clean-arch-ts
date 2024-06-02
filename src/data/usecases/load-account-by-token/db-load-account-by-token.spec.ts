import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('decrypted_value'))
    }
  }

  return new DecrypterStub()
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken Usecase ', () => {
  test('Call Decrypter with correct values', async () => {
    // Arrange
    const { sut, decrypterStub } = makeSut()

    // Mock
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    // Act
    await sut.load('any_token')

    // Assert
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
