// routes/mainRoutes.js
const express = require('express');
const router = express.Router();

// Route: GET /
// Nếu app.js dùng app.use('/', mainRoutes), thì đây sẽ là GET /
router.get('/', (req, res) => {
  res.send('Xin chào Thế giới từ Express! (từ mainRoutes)');
});

// Route: GET /chao
// Tương tự, đây sẽ là GET /chao
router.get('/chao', (req, res) => {
  res.send('Chào bạn! Đây là route /chao (từ mainRoutes).');
});

module.exports = router;