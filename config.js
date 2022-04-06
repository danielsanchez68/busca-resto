const dotenv = require('dotenv')

dotenv.config()

const STR_CNX = process.env.STR_CNX || 'mongodb://localhost:27017/mibase'

module.exports = {
    STR_CNX
}