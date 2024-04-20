import {
  AccountModel,
  AddAccountModel,
  AddAccountRepository,
  Hasher,
} from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password',
})

const makeAddAccountRepositoryStub = () => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeHasherStub = () => {
  class HasherStub implements Hasher {
    async hash(value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const addAccountRepositoryStub = makeAddAccountRepositoryStub()
  const hasherStub = makeHasherStub()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return { hasherStub, sut, addAccountRepositoryStub }
}

describe('DbAddACcount Use', () => {
  it('Call Hasher with correct password', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut()

    // Arrange (mock)
    const hashSpy = jest.spyOn(hasherStub, 'hash')

    // Act
    await sut.add(makeFakeAccountData())

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Throws if HasherStub throws', async () => {
    // Arrange
    const { sut, hasherStub } = makeSut()

    // Arrange (mock)
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const promise = sut.add(makeFakeAccountData())

    // Assert
    await expect(promise).rejects.toThrow()
  })

  it('Call AddAccountRepository with correct values', async () => {
    // Arrange
    const { sut, addAccountRepositoryStub } = makeSut()

    // Arrange (mock)
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    // Act
    await sut.add(makeFakeAccountData())

    // Assert
    await expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password',
    })
  })

  it('Throws if AddAccountRepository throws', async () => {
    // Arrange
    const { sut, addAccountRepositoryStub } = makeSut()

    // Arrange (mock)
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    // Act
    const promise = sut.add(makeFakeAccountData())

    // Assert
    await expect(promise).rejects.toThrow()
  })

  it('Return an account on success', async () => {
    // Arrange
    const { sut } = makeSut()

    // Act
    const account = await sut.add(makeFakeAccountData())

    // Assert
    expect(account).toEqual(makeFakeAccount())
  })
})
