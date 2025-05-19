// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

router.post('/initiate', bookingController.initiateBooking); // API để tìm phòng và giữ chỗ
router.patch('/:bookingId/cancel', bookingController.cancelBooking); // API hủy booking đang chờ
router.patch('/:bookingId/confirm', bookingController.confirmBooking); // API xác nhận sau thanh toán

// Bạn có thể thêm các route khác như lấy danh sách booking, lấy chi tiết booking sau
// router.get('/', bookingController.getAllBookings);
// router.get('/:bookingId', bookingController.getBookingById);

module.exports = router;