const express = require('express');
const app = express();
const apiRouter = require('./src/api/index');
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
});
