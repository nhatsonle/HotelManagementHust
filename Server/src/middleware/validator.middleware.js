// Middleware validate request body/params (nếu cần)

module.exports = {
  validateRequestBody: (req, res, next) => {
    // Implement validation logic for request body
    next();
  },
  validateRequestParams: (req, res, next) => {
    // Implement validation logic for request params
    next();
  }
};