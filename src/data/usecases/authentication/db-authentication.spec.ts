import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password',
})

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  name: 'any_name',
  password: 'any_password',
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

type SutType = {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutType => {
  const loadAccountByEmailRepositoryStub =
    makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return { sut, loadAccountByEmailRepositoryStub }
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
})
