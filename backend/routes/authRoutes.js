const express = require("express");
const { createOtp, verifyOtp } = require("../controllers/Otp");

const router = express.Router();

router.post("/create", createOtp);
router.post('/verify', verifyOtp);

module.exports = router;