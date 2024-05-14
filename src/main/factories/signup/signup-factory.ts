import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const encrypter = new JwtAdapter(env.jwtSecret)
  const accountRepository = new AccountMongoRepository()
  const authentication = new DbAuthentication(
    accountRepository,
    bcryptAdapter,
    encrypter,
    accountRepository,
  )
  const addAccount = new DbAddAccount(bcryptAdapter, accountRepository)
  const signUpController = new SignUpController(
    addAccount,
    makeSignUpValidation(),
    authentication,
  )
  const logMongoRepository = new LogMongoRepository()

  return new LogControllerDecorator(signUpController, logMongoRepository)
}
