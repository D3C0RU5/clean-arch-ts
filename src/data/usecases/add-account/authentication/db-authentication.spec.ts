import { LoadAccountByEmailRepository } from '../../../protocols/load-account-by-email-repository'
import { AccountModel } from '../db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const makeLoadAccountByEmailRepositoryStub =
  (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements LoadAccountByEmailRepository
    {
      async load(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          email: 'any_email@mail.com',
          name: 'any_name',
          password: 'any_password',
        }
        return new Promise(resolve => resolve(account))
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
    // Arrange
    const { sut, loadAccountByEmailRepository } = makeSut()

    // Arrange(mock)
    const loadSpy = jest.spyOn(loadAccountByEmailRepository, 'load')

    // Act
    await sut.auth({ email: 'any_email@mail.com', password: 'any_password' })

    // Assert
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
