require('dotenv').config()

const mongoUrl = process.env.MONGO_URL
const PORT = process.env.PORT || 3003

module.exports = {
  mongoUrl,
  PORT
}