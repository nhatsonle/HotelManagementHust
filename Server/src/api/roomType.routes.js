// Định nghĩa routes cho quản lý loại phòng

const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomType.controller');

router.route('/')
  .get(roomTypeController.getRoomTypes)         // GET /api/room-types
  .post(roomTypeController.createRoomType);     // POST /api/room-types

router.route('/:id')
  .get(roomTypeController.getRoomTypeById)      // GET /api/room-types/:id
  .put(roomTypeController.updateRoomType)       // PUT /api/room-types/:id
  .delete(roomTypeController.deleteRoomType);   // DELETE /api/room-types/:id

module.exports = router;
