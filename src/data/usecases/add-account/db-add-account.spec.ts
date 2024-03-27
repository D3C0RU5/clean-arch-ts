import { DbAddAccount } from './db-add-account'

class EncrypterStub {
  async encrypt(value: string): Promise<string> {
    return new Promise(resolve => resolve('hashed_password'))
  }
}

describe('DbAddACcount Use', () => {
  it('Call Encrypter with correct password', () => {
    // Arrange
    const encrypterStub = new EncrypterStub()
    const sut = new DbAddAccount(encrypterStub)
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
