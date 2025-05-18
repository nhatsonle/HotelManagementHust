// Định nghĩa routes cho báo cáo/thống kê

const express = require('express');
const router = express.Router();

// Import các controller cần thiết
const dashboardController = require('./dashboard.controller');

// Định nghĩa các routes
router.get('/summary', dashboardController.getSummary);
router.get('/details', dashboardController.getDetails);

module.exports = router;