import { AccountModel } from '../../usecases/add-account/db-add-account-protocols'

export type LoadAccountByEmailRepository = {
  load(email: string): Promise<AccountModel>
}
