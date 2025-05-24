const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/swagger.config');
const app = express();
const apiRouter = require('./src/api/index');
const PORT = process.env.PORT || 3000;

// ✅ Enable CORS for all origins (or restrict to frontend)
app.use(cors({
  origin: '*', // or '*' for dev
  optionsSuccessStatus: 200
}));

// ✅ Handle preflight requests
app.options('*', cors());


app.use(express.json());

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
