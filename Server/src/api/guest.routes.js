// routes/guestRoutes.js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller'); // Nạp controller

// Định nghĩa các routes và gắn chúng với các phương thức trong controller
router.get('/', guestController.getAllGuests);
router.post('/', guestController.createGuest);
router.get('/:guestId', guestController.getGuestById);
router.put('/:guestId', guestController.updateGuest);
router.patch('/:guestId', guestController.patchGuest); // Có thể dùng chung hàm update hoặc tạo hàm riêng cho PATCH
router.delete('/:guestId', guestController.deleteGuest);

module.exports = router;