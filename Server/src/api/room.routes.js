// Định nghĩa routes cho quản lý phòng

const express = require('express');
const router = express.Router();

// Import controller
const roomController = require('../controllers/room.controller');

// Basic CRUD routes
router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.post('/', roomController.createRoom);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

// Status update route
router.patch('/:id/status', roomController.updateRoomStatus);

module.exports = router;