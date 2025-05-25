const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const verifyToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user info to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(createError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(createError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

// Middleware to check user role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, 'Access denied'));
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};