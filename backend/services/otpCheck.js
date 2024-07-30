const nodemailer = require('nodemailer');
const generateOTP = require('otp-generator');
const Otp = require('../models/Otp');
const serverConfig = require('../config/server-config');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: serverConfig.MAIL,
        pass: serverConfig.PASS
    }
});


const otpMap = {};
const otpAttemptTracker = {};
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 60 * 60 * 1000;

const generateAndStoreOTP = (email) => {
    const otp = generateOTP.generate(6, { upperCaseAlphabets: false, specialChars: false });
    otpMap[email] = otp;
    return otp;
};


const sendOTP = async (email) => {
    const currentTime = Date.now();
    if (otpAttemptTracker[email] && otpAttemptTracker[email].blockedUntil > currentTime) {
        console.log(otpAttemptTracker[email].blockedUntil,"ffff")
        console.log('User is blocked. Please try again later.');
        return;
    }
    if (otpAttemptTracker[email]) {
        otpAttemptTracker[email].attempts += 1;

        if (otpAttemptTracker[email].attempts >= MAX_ATTEMPTS) {
            otpAttemptTracker[email].blockedUntil = currentTime + BLOCK_DURATION_MS;
            otpAttemptTracker[email].attempts = 0; 
            console.log('User is blocked for 1 hour due to too many OTP requests.');
            return;
        }
    } else {
        otpAttemptTracker[email] = {
            attempts: 1,
            blockedUntil: 0
        };
    }

    const otp = generateAndStoreOTP(email); 

    const mailOptions = {
        from: serverConfig.MAIL,
        to: email,
        subject: 'Movie App Access OTP',
        text: `Your OTP for accessing Movie App resources: ${otp}`
    };

    try {
        await transporter.sendMail(mailOptions);
        return otp;
    } catch (error) {
        console.error('Error sending email:', error);
  
    }
};

const saveOTPToDatabase = async (email, otp) => {
    try {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 
        await Otp.create({ email, otp, expiresAt  }); 
        console.log('OTP saved to database:');
    } catch (error) {
        console.error('Error saving OTP to database:', error);
     
    }
};

const verifyOTPAndSave = async (email, userEnteredOTP) => {
    try {
        const otp = otpMap[email];
        const otpRecord = await Otp.findOne({ where: { email, otp: userEnteredOTP } });
        console.log("gg", otp);
        if (!otp) {
            console.log("otp not found")
        }
        const currentTime = Date.now();
        if (otpRecord.expiresAt < currentTime) {
            return false;
        }
        if (otp === userEnteredOTP) {
            await Otp.update({ verified: true }, { where: { email } });
            console.log('OTP verified and saved to database');
            return true;
        } else {
            console.log("Invalid OTP")
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
       
    }
};
const cleanupExpiredOTPs = async () => {
    try {
        const currentTime = Date.now();
        await Otp.destroy({ where: { expiresAt: { [Op.lt]: currentTime } } });
    } catch (error) {
        console.error('Error cleaning up expired OTPs:', error);
    }
};

module.exports = {
    sendOTP,
    saveOTPToDatabase,
    verifyOTPAndSave,
    cleanupExpiredOTPs
};
