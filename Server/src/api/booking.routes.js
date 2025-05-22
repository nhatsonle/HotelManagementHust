// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.post('/initiate', bookingController.initiateBooking); // API để tìm phòng và giữ chỗ
router.patch('/:bookingId/cancel', bookingController.cancelBooking); // API hủy booking đang chờ
router.patch('/:bookingId/confirm', bookingController.confirmBooking); // API xác nhận sau thanh toán

router.get('/', bookingController.getAllBooking);
router.get('/:bookingId', bookingController.getBookingById);
router.get('/guest/:guestName', bookingController.findAllBookingsByGuestName);
router.put('/:bookingId', bookingController.editBooking);
router.delete('/:bookingId', bookingController.deleteBooking);



module.exports = router;