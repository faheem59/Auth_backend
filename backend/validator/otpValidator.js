const Validator = require('fastest-validator');
const v = new Validator();

const otpSchema = {
    email: { type: "email", optional: false },
    otp: { type: "string", min: 6, max: 6, optional: false }
};

const validateCreateOtp = v.compile({ email: otpSchema.email });
const validateVerifyOtp = v.compile(otpSchema);

module.exports = { validateCreateOtp, validateVerifyOtp };
