import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
}))

describe('Bcrypt Adapter', () => {
  it('Call bcrypt with correct values', async () => {
    // Arrange
    const salt = 12
    const sut = new BcryptAdapter(salt)

    // Arrange (mock)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    // Act
    await sut.encrypt('any_value')

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Return a hash on success', async () => {
    // Arrange
    const salt = 12
    const sut = new BcryptAdapter(salt)

    // Act
    const hash = await sut.encrypt('any_value')

    // Assert
    expect(hash).toBe('hash')
  })
})
