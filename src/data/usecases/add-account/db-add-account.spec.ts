import { Encrypter } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeEncrypterStub = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

type SutTypes = {
  sut: DbAddAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return { encrypterStub, sut }
}

describe('DbAddACcount Use', () => {
  it('Call Encrypter with correct password', async () => {
    // Arrange
    const { sut, encrypterStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }

    // Arrange (mock)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    // Act
    await sut.add(accountData)

    // Assert
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Throws if Encrypter throws', async () => {
    // Arrange
    const { sut, encrypterStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }

    // Arrange (mock)
    const encryptSpy = jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    // Act
    const promise = sut.add(accountData)

    // Assert
    await expect(promise).rejects.toThrow()
  })
})
