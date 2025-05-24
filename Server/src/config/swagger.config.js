const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Booking API',
      version: '1.0.0',
      description: 'API documentation for Hotel Booking application',
    },
    servers: [
      {
        url: 'https://hotelmanagementhust-m6i2.onrender.com/api' || 'http://localhost:3000', // Địa chỉ máy chủ của bạn
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/api/*.js'], // Đường dẫn đến các file chứa định nghĩa API
};

const specs = swaggerJsdoc(options);
module.exports = specs;
