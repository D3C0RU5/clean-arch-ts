import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('Return default content type as json', async () => {
    // Arrange
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    // Act
    const response = await request(app).get('/test_content_type')

    expect(response.headers['content-type']).toMatch(/json/)
  })
  it('Return XML content type when required', async () => {
    // Arrange
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })
    // Act
    const response = await request(app).get('/test_content_type_xml')

    expect(response.headers['content-type']).toMatch(/xml/)
  })
})
