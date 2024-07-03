import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },
  async verify(token: string): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  },
}))

const makeSut = (): JwtAdapter => {
  const sut = new JwtAdapter('secret')
  return sut
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    it('Call sign with correct params', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('Return a token on sign success', async () => {
      const sut = makeSut()

      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toBe('any_token')
    })

    it('Throw if sign throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.encrypt('any_id')

      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    it('Call verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    it('Return a value on verify success', async () => {
      const sut = makeSut()

      const accessToken = await sut.decrypt('any_token')

      expect(accessToken).toBe('any_value')
    })

    it('Throw if verify throws', async () => {
      const sut = makeSut()

      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })

      const promise = sut.decrypt('any_token')

      await expect(promise).rejects.toThrow()
    })
  })
})
