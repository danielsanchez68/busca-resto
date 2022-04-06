const dotenv = require('dotenv')

dotenv.config()

const STR_CNX = process.env.STR_CNX || 'mongodb://localhost:27017/mibase'
const VERSION = 'v9'

module.exports = {
    STR_CNX,
    VERSION
}