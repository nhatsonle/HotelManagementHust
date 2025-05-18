// Middleware ghi log request (nếu cần)

const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

module.exports = requestLogger;