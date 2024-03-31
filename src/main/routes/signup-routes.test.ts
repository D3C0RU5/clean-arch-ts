import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  it('Return an account on success', async () => {
    // Act
    const response = await request(app)
      .post('/api/signup')
      .send({
        name: 'Taynara',
        email: 'taynarinha@gmail.com',
        password: '123',
        passwordConfirmation: '123',
      })

    // Assert
    expect(response.status).toBe(200)
  })
})
