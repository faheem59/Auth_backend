const dotenv = require("dotenv");

dotenv.config()

module.exports = {
    PORT: process.env.PORT,
    PASS: process.env.PASS,
    MAIL: process.env.MAIL,
    JWT_SECRET: process.env.JWT_SECRET
}