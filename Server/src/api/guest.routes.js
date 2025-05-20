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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   guest_id:
 *                     type: integer
 *                     description: ID của khách hàng
 *                   name:
 *                     type: string
 *                     description: Tên khách hàng
 *                   passport_number:
 *                     type: string
 *                     description: Số hộ chiếu
 *                   phone:
 *                     type: string
 *                     description: Số điện thoại
 *                   email:
 *                     type: string
 *                     description: Địa chỉ email
 *                   city:
 *                     type: string
 *                     description: Thành phố
 *                   region:
 *                     type: string
 *                     description: Khu vực
 *                   address:
 *                     type: string
 *                     description: Địa chỉ chi tiết
 *                   zip_code:
 *                     type: string
 *                     description: Mã bưu điện
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
 *         description: ID của khách hàng
 *     responses:
 *       200:
 *         description: Thông tin khách hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guest_id:
 *                   type: integer
 *                   description: ID của khách hàng
 *                 name:
 *                   type: string
 *                   description: Tên khách hàng
 *                 passport_number:
 *                   type: string
 *                   description: Số hộ chiếu
 *                 phone:
 *                   type: string
 *                   description: Số điện thoại
 *                 email:
 *                   type: string
 *                   description: Địa chỉ email
 *                 city:
 *                   type: string
 *                   description: Thành phố
 *                 region:
 *                   type: string
 *                   description: Khu vực
 *                 address:
 *                   type: string
 *                   description: Địa chỉ chi tiết
 *                 zip_code:
 *                   type: string
 *                   description: Mã bưu điện
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
 *                 description: Tên khách hàng
 *               passport_number:
 *                 type: string
 *                 description: Số hộ chiếu
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Địa chỉ email
 *               city:
 *                 type: string
 *                 description: Thành phố
 *               region:
 *                 type: string
 *                 description: Khu vực
 *               address:
 *                 type: string
 *                 description: Địa chỉ chi tiết
 *               zip_code:
 *                 type: string
 *                 description: Mã bưu điện
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guest_id:
 *                   type: integer
 *                   description: ID của khách hàng
 *                 name:
 *                   type: string
 *                   description: Tên khách hàng
 *                 passport_number:
 *                   type: string
 *                   description: Số hộ chiếu
 *                 phone:
 *                   type: string
 *                   description: Số điện thoại
 *                 email:
 *                   type: string
 *                   description: Địa chỉ email
 *                 city:
 *                   type: string
 *                   description: Thành phố
 *                 region:
 *                   type: string
 *                   description: Khu vực
 *                 address:
 *                   type: string
 *                   description: Địa chỉ chi tiết
 *                 zip_code:
 *                   type: string
 *                   description: Mã bưu điện
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
 *         description: ID của khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên khách hàng
 *               passport_number:
 *                 type: string
 *                 description: Số hộ chiếu
 *               phone:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Địa chỉ email
 *               city:
 *                 type: string
 *                 description: Thành phố
 *               region:
 *                 type: string
 *                 description: Khu vực
 *               address:
 *                 type: string
 *                 description: Địa chỉ chi tiết
 *               zip_code:
 *                 type: string
 *                 description: Mã bưu điện
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guest_id:
 *                   type: integer
 *                   description: ID của khách hàng
 *                 name:
 *                   type: string
 *                   description: Tên khách hàng
 *                 passport_number:
 *                   type: string
 *                   description: Số hộ chiếu
 *                 phone:
 *                   type: string
 *                   description: Số điện thoại
 *                 email:
 *                   type: string
 *                   description: Địa chỉ email
 *                 city:
 *                   type: string
 *                   description: Thành phố
 *                 region:
 *                   type: string
 *                   description: Khu vực
 *                 address:
 *                   type: string
 *                   description: Địa chỉ chi tiết
 *                 zip_code:
 *                   type: string
 *                   description: Mã bưu điện
 *       404:
 *         description: Không tìm thấy khách
 */
router.put('/:id', guestController.updateGuest);

/**
 * @swagger
 * /guests/{id}:
 *   delete:
 *     summary: Xóa khách hàng
 *     tags: [Guests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của khách hàng
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy khách
 */
router.delete('/:id', guestController.deleteGuest);

module.exports = router;