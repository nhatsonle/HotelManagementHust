// Định nghĩa routes cho quản lý phản hồi

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');

// Route để lấy danh sách phản hồi
router.get('/', feedbackController.getAllFeedback);

// Route để tạo phản hồi mới
router.post('/', feedbackController.createFeedback);

// Route để cập nhật phản hồi
router.put('/:id', feedbackController.updateFeedback);

// Route để xóa phản hồi
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;