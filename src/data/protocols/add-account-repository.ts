import { AddAccountModel } from '../../domain/usecases/add-account'
import { AccountModel } from '../../domain/models/account'

export type AddAccountRepository = {
  add(accountData: AddAccountModel): Promise<AccountModel>
}
