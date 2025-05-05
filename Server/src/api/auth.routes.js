// Định nghĩa routes cho xác thực người dùng (login, register, ...)
const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

// Route for user login
router.post('/login', authController.login);

// Route for user registration
router.post('/register', authController.register);

module.exports = router;