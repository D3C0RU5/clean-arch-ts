import { AddAccount } from '../../../domain/usecases/add-account'
import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { EmailValidator } from '../../protocols/email-validator'

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { password, passwordConfirmation, name, email } = httpRequest.body

      if (password != passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      })

      return ok(account)
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
