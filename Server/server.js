const express = require('express');
const app = express();
require('dotenv').config()
const apiRoutes = require('./src/api');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerOptions = require('./src/config/swagger.config');
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Hotel Management API is running!');
});

// TODO: Mount routers from ./src/api when ready

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});