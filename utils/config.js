require('dotenv').config()

let mongoUrl = process.env.MONGO_URL

if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.TEST_MONGODB_URI
}

const PORT = process.env.PORT || 3003

module.exports = {
  mongoUrl,
  PORT
}