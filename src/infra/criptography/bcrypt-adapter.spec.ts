import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare(value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  },
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Call hash with correct values', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    const hashSpy = jest.spyOn(bcrypt, 'hash')

    // Act
    await sut.hash('any_value')

    // Assert
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Return a valid hash on hash success', async () => {
    // Arrange
    const sut = makeSut()

    // Act
    const hash = await sut.hash('any_value')

    // Assert
    expect(hash).toBe('hash')
  })

  it('Throw if hash throws', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn<any, string>(bcrypt, 'hash').mockRejectedValueOnce(new Error())

    // Act
    const promise = sut.hash('any_value')

    // Assert
    await expect(promise).rejects.toThrow()
  })

  it('Call compare with correct values', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    const compareSpy = jest.spyOn(bcrypt, 'compare')

    // Act
    await sut.compare('any_value', 'any_hash')

    // Assert
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('Return true when compare succeeds', async () => {
    // Arrange
    const sut = makeSut()

    // Act
    const isValid = await sut.compare('any_value', 'any_hash')

    // Assert
    expect(isValid).toBe(true)
  })

  it('Return false when compare fails', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn<any, string>(bcrypt, 'compare').mockResolvedValueOnce(false)

    // Act
    const isValid = await sut.compare('any_value', 'any_hash')

    // Assert
    expect(isValid).toBe(false)
  })

  it('Throw if compare throws', async () => {
    // Arrange
    const sut = makeSut()

    // Arrange (mock)
    jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn<any, string>(bcrypt, 'compare')
      .mockRejectedValueOnce(new Error())

    // Act
    const promise = sut.compare('any_value', 'any_hash')

    // Assert
    await expect(promise).rejects.toThrow()
  })
})
