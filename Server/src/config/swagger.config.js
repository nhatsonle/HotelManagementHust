module.exports = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hotel Management API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // ✅ Đường dẫn gốc đúng
      },
    ],
  },
  apis: ['./src/api/*.js'],
};
