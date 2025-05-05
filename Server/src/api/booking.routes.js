// Định nghĩa routes cho quản lý đặt phòng

const express = require('express');
const router = express.Router();

// Import các controller cần thiết
const bookingController = require('./booking.controller');

// Định nghĩa các routes
router.post('/create', bookingController.createBooking);
router.get('/list', bookingController.listBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;