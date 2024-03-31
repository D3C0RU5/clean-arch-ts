export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://root:root@localhost:27017',
  port: process.env.port || 5050,
  mongoDbName: 'jetmoney',
}
