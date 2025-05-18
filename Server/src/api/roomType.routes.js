// Định nghĩa routes cho quản lý loại phòng

const express = require('express');
const router = express.Router();
const roomTypeController = require('./roomType.controller');

// Route để lấy danh sách loại phòng
router.get('/', roomTypeController.getAllRoomTypes);

// Route để lấy thông tin chi tiết của một loại phòng
router.get('/:id', roomTypeController.getRoomTypeById);

// Route để tạo mới một loại phòng
router.post('/', roomTypeController.createRoomType);

// Route để cập nhật thông tin một loại phòng
router.put('/:id', roomTypeController.updateRoomType);

// Route để xóa một loại phòng
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;