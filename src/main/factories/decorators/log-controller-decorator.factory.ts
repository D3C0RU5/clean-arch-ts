import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '../../../presentation/protocols'

export const makeLogControllerDecorator = (
  controller: Controller,
): Controller => {
  return new LogControllerDecorator(controller, new LogMongoRepository())
}
