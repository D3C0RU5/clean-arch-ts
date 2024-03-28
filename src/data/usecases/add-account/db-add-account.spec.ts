import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeAddAccountRepositoryStub = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountRepositoryStub()
}

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
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const encrypterStub = makeEncrypterStub()
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return { encrypterStub, sut, addAccountRepositoryStub }
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

  it('Call AddAccountRepository with correct values', async () => {
    // Arrange
    const { sut, addAccountRepositoryStub } = makeSut()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    }

    // Arrange (mock)
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    // Act
    await sut.add(accountData)

    // Assert
    await expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    })
  })
})
