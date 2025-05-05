// auth.service.js

// Chứa logic hash password, tạo/xác thực token cho xác thực người dùng

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
};