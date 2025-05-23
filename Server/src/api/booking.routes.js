// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Quản lý booking
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Retrieve all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: List of all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
router.get('/', bookingController.getAllBooking);


router.post('/initiate', bookingController.initiateBooking); // API để tìm phòng và giữ chỗ


router.patch('/:bookingId/cancel', bookingController.cancelBooking); // API hủy booking đang chờ
router.patch('/:bookingId/confirm', bookingController.confirmBooking); // API xác nhận sau thanh toán


/**
 * @swagger
 * /:
 *   get:
 *     summary: Lấy danh sách bookings 
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Trả về danh sách khách
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   booking_id:
 *                     type: integer
 *                     description: ID của booking
 *                   guest_id:
 *                     type: integer
 *                     description: ID của khách
 *                   room_id:
 *                     type: integer
 *                     description: ID của phòng
 *                     
 *                   check_in:
 *                     type: date
 *                     description: Ngày nhận phòng
 *                     
 *                   check_out:
 *                     type: date
 *                    description: Ngày trả phòng
 *                   total_amount:
 *                    type: number
 *                   description: Tổng số tiền
 *                   amount_paid:
 *                     type: number
 *                    description: Số tiền đã thanh toán
 *                  status:
 *                    type: enum
 *                    description: Trạng thái của booking
 *                 created_at:
 *                   type: date
 *                  description: Ngày tạo booking
 *                  updated_at:
 *                   type: date
 *                  description: Ngày cập nhật booking
 *                  num_adults:
 *                   type: integer
 *                  description: Số lượng người lớn
 *                 num_children:
 *                  type: integer
 *                 description: Số lượng trẻ em
 *                   
 */
router.get('/', bookingController.getAllBooking);


router.get('/:bookingId', bookingController.getBookingById);
router.get('/guest/:guestName', async (req, res, next) => {
  try {
    const { guestName } = req.params;
    const bookings = await bookingController.findAllBookingsByGuestName(guestName);
    
    if (bookings.length > 0) {
      res.status(200).json(bookings);
    } else {
      res.status(404).json({ message: `No bookings found for guest: ${guestName}` });
    }
  } catch (error) {
    next(error);
  }
});
router.put('/:bookingId', bookingController.editBooking);
router.delete('/:bookingId', bookingController.deleteBooking);



/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         booking_id:
 *           type: integer
 *           description: Auto-generated booking ID
 *         guest_id:
 *           type: integer
 *           description: ID of the guest
 *         room_id:
 *           type: integer
 *           description: ID of the room
 *         check_in:
 *           type: string
 *           format: date
 *           description: Check-in date
 *         check_out:
 *           type: string
 *           format: date
 *           description: Check-out date
 *         total_amount:
 *           type: number
 *           description: Total booking amount
 *         amount_paid:
 *           type: number
 *           description: Amount already paid
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           description: Current booking status
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Booking creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         num_adults:
 *           type: integer
 *           description: Number of adult guests
 *         num_children:
 *           type: integer
 *           description: Number of child guests
 *       required:
 *         - guest_id
 *         - room_id
 *         - check_in
 *         - check_out
 */

/**
 * @swagger
 * /bookings/initiate:
 *   post:
 *     summary: Initiate a new booking and hold room
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guest_id:
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               check_in:
 *                 type: string
 *                 format: date
 *               check_out:
 *                 type: string
 *                 format: date
 *               num_adults:
 *                 type: integer
 *               num_children:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking initiated successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Room not available for selected dates
 */

/**
 * @swagger
 * /bookings/{bookingId}/cancel:
 *   patch:
 *     summary: Cancel a pending booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Booking cannot be cancelled
 */

/**
 * @swagger
 * /bookings/{bookingId}/confirm:
 *   patch:
 *     summary: Confirm booking after payment
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount_paid:
 *                 type: number
 *     responses:
 *       200:
 *         description: Booking confirmed successfully
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/{bookingId}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Booking not found
 *   put:
 *     summary: Update booking details
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /bookings/guest/{guestName}:
 *   get:
 *     summary: Find all bookings by guest name
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: guestName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of bookings found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       404:
 *         description: No bookings found for this guest
 */

module.exports = router;