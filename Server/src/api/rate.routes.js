// Định nghĩa routes cho quản lý giá/khuyến mãi

const express = require('express');
const router = express.Router();
const rateController = require('./rate.controller');

// Route để lấy danh sách giá/khuyến mãi
router.get('/', rateController.getRates);

// Route để tạo mới giá/khuyến mãi
router.post('/', rateController.createRate);

// Route để cập nhật giá/khuyến mãi
router.put('/:id', rateController.updateRate);

// Route để xóa giá/khuyến mãi
router.delete('/:id', rateController.deleteRate);

module.exports = router;