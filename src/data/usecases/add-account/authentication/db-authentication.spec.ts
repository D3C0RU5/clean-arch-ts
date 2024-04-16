import { AuthenticationModel } from '../../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../../protocols/load-account-by-email-repository'
import { AccountModel } from '../db-add-account-protocols'
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
    async load(email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  return new LoadAccountByEmailRepositoryStub()
}

type SutType = {
  sut: DbAuthentication
  loadAccountByEmailRepository: LoadAccountByEmailRepository
}
const makeSut = (): SutType => {
  const loadAccountByEmailRepository = makeLoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepository)

  return { sut, loadAccountByEmailRepository }
}

describe('DbAuthentication UseCase', () => {
  it('Call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepository } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')

    await sut.auth(makeFakeAuthentication())

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
