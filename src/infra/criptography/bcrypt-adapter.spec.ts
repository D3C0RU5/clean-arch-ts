import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Call bcrypt with correct values', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    // Act
    await sut.hash('any_value')

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Return a hash on success', async () => {
    // Arrange
    const sut = makeSut()

    // Act
    const hash = await sut.hash('any_value')

    // Assert
    expect(hash).toBe('hash')
  })

  it('Throw if bcrypt throw a hash on success', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn<any, string>(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error())
      }),
    )

    // Act
    const promise = sut.hash('any_value')

    // Assert
    await expect(promise).rejects.toThrow()
  })
})
