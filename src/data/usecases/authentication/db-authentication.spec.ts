import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { DbAuthentication } from './db-authentication'
import {
  AccountModel,
  HashComparer,
  LoadAccountByEmailRepository,
  Encrypter,
  UpdateAccessTokenRepository,
} from './db-authentication-protocols'

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'hashed_password',
})

function makeLoadAccountByEmailRepositoryStub(): LoadAccountByEmailRepository {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async load(email: string): Promise<AccountModel | null> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

function makeHashComparer(): HashComparer {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new HashComparerStub()
}

function makeEncrypter(): Encrypter {
  class EncrypterStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

function makeUpdateAccessTokenRepository(): UpdateAccessTokenRepository {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update(id: string, token: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

type SutType = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}
const makeSut = (): SutType => {
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  }
}

describe('DbAuthentication UseCase', () => {
  it('Call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockRejectedValue(new Error())

    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })

  it('Return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockResolvedValueOnce(null)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe(null)
  })

  it('Call HashCompare with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')

    await sut.auth(makeFakeAuthentication())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  it('Throw if HashCompare throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockRejectedValue(new Error())

    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })

  it('Return null if HashCompare returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe(null)
  })

  it('Call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())

    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  it('Throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValue(new Error())

    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })

  it('Return a token on success', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.auth(makeFakeAuthentication())

    expect(accessToken).toBe('any_token')
  })

  it('Call UpdateAccesTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  it('Throw if UpdateAccesTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccessTokenRepositoryStub, 'update')
      .mockRejectedValue(new Error())

    await expect(sut.auth(makeFakeAuthentication())).rejects.toThrow()
  })
})
