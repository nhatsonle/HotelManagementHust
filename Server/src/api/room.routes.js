// Định nghĩa routes cho quản lý phòng

const express = require('express');
const router = express.Router();

// Import controller
const roomController = require('./room.controller');

// Routes
router.get('/', roomController.getAllRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;