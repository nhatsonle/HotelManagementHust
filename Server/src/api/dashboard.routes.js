const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API thống kê và tổng quan hệ thống
 */

/**
 * @swagger
 * /dashboard/today-summary:
 *   get:
 *     summary: Lấy số lượng check-in, check-out và khách hiện tại trong khách sạn
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Trả về thống kê trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checkIn:
 *                   type: integer
 *                   example: 23
 *                 checkOut:
 *                   type: integer
 *                   example: 13
 *                 inHotel:
 *                   type: integer
 *                   example: 60
 */
router.get('/today-summary', controller.getTodaySummary);

/**
 * @swagger
 * /dashboard/room-types:
 *   get:
 *     summary: Lấy thông tin các loại phòng và trạng thái sử dụng
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Danh sách loại phòng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   room_type:
 *                     type: string
 *                     example: Double sharing
 *                   occupied:
 *                     type: integer
 *                     example: 2
 *                   total:
 *                     type: integer
 *                     example: 35
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 1068
 */
router.get('/room-types', controller.getRoomTypes);

/**
 * @swagger
 * /dashboard/room-status:
 *   get:
 *     summary: Thống kê số lượng phòng theo trạng thái (occupied, clean, dirty...)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Thống kê trạng thái phòng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 occupied:
 *                   type: integer
 *                   example: 104
 *                 available:
 *                   type: integer
 *                   example: 20
 *                 clean:
 *                   type: integer
 *                   example: 90
 *                 dirty:
 *                   type: integer
 *                   example: 4
 *                 inspected:
 *                   type: integer
 *                   example: 60
 */
router.get('/room-status', controller.getRoomStatus);

/**
 * @swagger
 * /dashboard/occupancy-monthly:
 *   get:
 *     summary: Tỷ lệ sử dụng phòng theo tháng (cho biểu đồ dashboard)
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Trả về dữ liệu thống kê phòng theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                     example: Jan
 *                   bookings:
 *                     type: integer
 *                     example: 45
 */
router.get('/occupancy-monthly', controller.getMonthlyOccupancy);

module.exports = router;
