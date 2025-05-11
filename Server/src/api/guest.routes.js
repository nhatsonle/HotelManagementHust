const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guest.controller');

/**
 * @swagger
 * tags:
 *   name: Guests
 *   description: Quản lý khách hàng
 */

/**
 * @swagger
 * /guests:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [Guests]
 *     responses:
 *       200:
 *         description: Trả về danh sách khách
 */
router.get('/', guestController.getAllGuests);

/**
 * @swagger
 * /guests/{id}:
 *   get:
 *     summary: Lấy khách hàng theo ID
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin khách hàng
 *       404:
 *         description: Không tìm thấy khách
 */
router.get('/:id', guestController.getGuestById);

/**
 * @swagger
 * /guests:
 *   post:
 *     summary: Thêm khách hàng mới
 *     tags: [Guests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', guestController.createGuest);

/**
 * @swagger
 * /guests/{id}:
 *   put:
 *     summary: Cập nhật thông tin khách hàng
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy khách
 */
router.put('/:id', guestController.updateGuest);

/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Xoá khách hàng
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xoá thành công
 *       404:
 *         description: Không tìm thấy khách
 */
router.delete('/:id', guestController.deleteGuest);

module.exports = router;
