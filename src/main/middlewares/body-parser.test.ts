import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  it('test', async () => {
    // Arrange
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body)
    })
    // Act
    const response = await request(app)
      .post('/test_body_parser')
      .send({ name: 'Taynara' })

    expect(response.body).toEqual({ name: 'Taynara' })
  })
})
