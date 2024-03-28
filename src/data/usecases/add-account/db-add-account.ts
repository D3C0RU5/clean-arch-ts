import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  Encrypter,
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(account: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = this.encrypter.encrypt(account.password)

    return new Promise(resolve =>
      resolve({
        id: '1',
        name: 'a',
        email: 'e',
        password: '',
      }),
    )
  }
}
