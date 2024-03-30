import app from './config/app'

export const server = app.listen(5050, () =>
  console.log('Server running at http://localhost:5050'),
)
