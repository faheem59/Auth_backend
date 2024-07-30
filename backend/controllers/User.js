const bcrypt = require('bcryptjs');
const validateUser = require('../validator/userValidator');
const User = require('../models/User');
const messages = require('../config/message'); 
const sendToken = require('../utils/jwtToken');
const respondWithStatus  = require('../utils/statusCode');
const Otp = require('../models/Otp');
const { where } = require('sequelize');

exports.createUser = async (req, res) => {
    try {
        const email = req.decodedEmail;
        const { username, phone, address, password, } = req.body;
        
        const validationResult = validateUser({ username, phone, password });

        if (validationResult !== true) {
            return respondWithStatus(res, 400, messages.error.validationError, { details: validationResult });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return respondWithStatus(res, 400, messages.error.usernameInUse);
        }
        if (!email) {
            return respondWithStatus(res, 400, messages.error.emailNotFound);
        }

        const newUser = await User.create({
            username,
            phone,
            address,
            password,
            email   
        });

        
        respondWithStatus(res, 201, messages.success.userCreated, { user: newUser });
    
        await Otp.destroy({ where: email });
        
    } catch (error) {
        respondWithStatus(res, 500, messages.error.saveFailed);
    }
};


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    const validationResult = validateUser({ username, password });

    if (validationResult !== true) {
        return respondWithStatus(res, 400, messages.error.validationError, { details: validationResult });
    }

    try {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return respondWithStatus(res, 401, messages.error.invalidCredentials);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return respondWithStatus(res, 401, messages.error.invalidCredentials);
        }

        sendToken(user, 200, res);
    } catch (error) {
        respondWithStatus(res, 500, messages.error.loginFailed);
    }
};
