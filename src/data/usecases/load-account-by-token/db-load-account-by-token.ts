import { LoadAccountByToken } from '../../../domain/usecases/load-account-by-token'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor(private readonly decrypter: Decrypter) {}

  async load(
    accessToken: string,
    role?: string | undefined,
  ): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
