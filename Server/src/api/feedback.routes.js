const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedback.controller');

/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: Góp ý từ khách hàng
 */

router.get('/', controller.getAllFeedbacks);

/**
 * @swagger
 * /feedbacks/recent:
 *   get:
 *     summary: Lấy 5 phản hồi mới nhất cho dashboard
 *     tags: [Feedbacks]
 *     responses:
 *       200:
 *         description: Danh sách phản hồi
 */
router.get('/recent', controller.getRecentFeedbacks);

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Gửi phản hồi mới
 *     tags: [Feedbacks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [guest_id, room_id, comment]
 *             properties:
 *               guest_id:
 *                 type: integer
 *               room_id:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post('/', controller.createFeedback);

/**
 * @swagger
 * /feedbacks/{id}:
 *   delete:
 *     summary: Xoá phản hồi theo ID
 *     tags: [Feedbacks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xoá thành công
 */
router.delete('/:id', controller.deleteFeedback);

module.exports = router;
