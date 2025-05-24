const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger.config');
const app = express();
require('dotenv').config()
const apiRoutes = require('./src/api');
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors()); 


app.use(express.json());
app.use('/api', apiRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./src/config/swagger.config');
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount the API router
app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hotel Management API is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
