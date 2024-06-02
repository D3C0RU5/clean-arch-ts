import { AccountModel } from '../../../usecases/add-account/db-add-account-protocols'

export type LoadAccountByTokenRepository = {
  loadByToken(token: string, role?: string): Promise<AccountModel | null>
}
