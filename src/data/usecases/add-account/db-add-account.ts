import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository,
  Encrypter,
} from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly encrypter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository,
  ) {}

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password)

    const accout = await this.addAccountRepository.add(
      Object.assign({}, accountData, { password: hashedPassword }),
    )

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
