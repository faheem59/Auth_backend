const message = require("../config/message");
const { sendOTP, saveOTPToDatabase, verifyOTPAndSave } = require("../services/otpCheck");
const { validateCreateOtp, validateVerifyOtp } = require('../validator/otpValidator');
const  respondWithStatus  = require('../utils/statusCode');
const Otp = require("../models/Otp");
const { generateToken } = require("../utils/authToken");

exports.createOtp = async (req, res) => {
    const { email } = req.body;

    const validationResult = validateCreateOtp({ email });

    if (validationResult !== true) {
        return respondWithStatus(res, 400, message.error.validationError, { details: validationResult });
    }

    try {
        const emailExists = await Otp.findOne({
            where: {
                email: email
            }
        })
        if (emailExists) {
            return respondWithStatus(res, 400, message.error.emailExitsError);
        }
        const otp = await sendOTP(email);
        await saveOTPToDatabase(email, otp);
        respondWithStatus(res, 200, message.success.otpSuccessful);
    } catch (error) {
        respondWithStatus(res, 500, message.error.otpError);
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const validationResult = validateVerifyOtp({ email, otp });

    if (validationResult !== true) {
        return respondWithStatus(res, 400, message.error.validationError, { details: validationResult });
    }

    try {
        const isVerified = await verifyOTPAndSave(email, otp);
        console.log("iss", isVerified);
        if (isVerified) {
           
            const token = generateToken(email); 
            console.log(token, "token")
           
            respondWithStatus(res, 200, message.success.otpSuccess, { token });
            
        } else {
            respondWithStatus(res, 400, message.error.otpError2);
        }
    } catch (error) {
        respondWithStatus(res, 500, message.error.otpFailed);
    }
};
