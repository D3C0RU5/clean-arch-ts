import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import loginRoutes from '../routes/login-routes'

export const setupRoutes = (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  loginRoutes(router)
  // readdirSync(`${__dirname}/../routes/`).map(async file => {
  //   if (!file.includes('.test.')) {
  //     ;(await import(`../routes/${file}`)).default(router)
  //   }
  // })
}
