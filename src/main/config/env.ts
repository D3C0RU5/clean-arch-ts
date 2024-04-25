export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:root@localhost:27017',
  port: process.env.port || 5050,
  mongoDbName: 'jetmoney',
  jwtSecret: process.env.JWT_SECRET || 'c5565254-03be-4217-bcd3-3339129ec5b0',
}
