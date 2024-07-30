const jwt = require('jsonwebtoken');
const serverConfig = require('../config/server-config');

const generateToken = (email) => {
    const payload = { email };
    const secret = serverConfig.JWT_SECRET;
    const options = { expiresIn: '5m' }; 
    return jwt.sign(payload, secret, options);
};

module.exports = { generateToken };