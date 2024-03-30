import request from 'supertest'
import app from '../config/app'

describe('Cors Middleware', () => {
  it('Should enable CORS', async () => {
    // Arrange
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    // Act
    const response = await request(app).get('/test_cors')

    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })
})
