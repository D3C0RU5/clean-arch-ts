import { DbAddAccount } from './db-add-account'

const makeEncrypterStub = () => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }

  return new EncrypterStub()
}

const makeSut = () => {
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return { encrypterStub, sut }
}

describe('DbAddACcount Use', () => {
  it('Call Encrypter with correct password', () => {
    // Arrange
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }

    // Act
    sut.add(accountData)

    // Assert
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
