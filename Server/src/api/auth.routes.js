const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut, resetPassword } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Auth routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', verifyToken, signOut);
router.post('/reset-password', resetPassword);

module.exports = router;
