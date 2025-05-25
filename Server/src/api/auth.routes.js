const express = require('express');
const router = express.Router();
const { 
  signUp, 
  signIn, 
  signOut, 
  requestPasswordReset, 
  confirmPasswordReset, 
  changePassword 
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/request-reset-password', requestPasswordReset);
router.post('/confirm-reset-password', confirmPasswordReset);

// Protected routes
router.post('/signout', verifyToken, signOut);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
