import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator Adapter', () => {
  test('Return false if validator returns false', () => {
    // Arrange
    const sut = new EmailValidatorAdapter()

    // Act
    const isValid = sut.isValid('invalid_email@mail.com')

    // Assert
    expect(isValid).toBe(false)
  })
})
