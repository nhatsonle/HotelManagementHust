//Cấu hình Swagger/OpenAPI để tự động tạo tài liệu API Contract cho dự án Node.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Management API',
      version: '1.0.0',
      description: 'API documentation for Hotel Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/docs/*.swagger.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;