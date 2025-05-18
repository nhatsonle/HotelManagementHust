// Định nghĩa routes cho quản lý khách hàng

const express = require('express');
const router = express.Router();

// Import controller
const guestController = require('./guest.controller');

// Routes
router.get('/', guestController.getAllGuests);
router.get('/:id', guestController.getGuestById);
router.post('/', guestController.createGuest);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);

module.exports = router;