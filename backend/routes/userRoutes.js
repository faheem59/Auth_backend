const express = require("express");
const { createUser, loginUser } = require("../controllers/User");
const verifyToken = require("../middleware/auth");
const router = express.Router();

router.post('/register', verifyToken, createUser);
router.post('/login', loginUser);
module.exports = router;