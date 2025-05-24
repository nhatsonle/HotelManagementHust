// Định nghĩa routes cho quản lý phòng
const express = require('express');
const router = express.Router();

const roomController = require('../controllers/room.controller');

//  CRUD routes
router.get('/', roomController.getRooms);
router.post('/', roomController.createRoom);

// Available rooms route - must be before /:id routes
router.get('/available', roomController.getAvailableRooms);

// Routes with ID parameter
router.get('/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

// Status update route
router.patch('/:id/status', roomController.updateRoomStatus);

module.exports = router;