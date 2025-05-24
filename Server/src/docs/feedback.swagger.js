/**
 * @swagger
 * /api/v1/feedback:
 *   get:
 *     summary: Retrieve a list of feedback
 *     description: Retrieve a list of feedback from the feedback table.
 *     responses:
 *       200:
 *         description: A list of feedback.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   feedback_id:
 *                     type: integer
 *                     description: The feedback ID.
 *                     example: 1
 *                   guest_id:
 *                     type: integer
 *                     description: The ID of the guest who left the feedback.
 *                     example: 101
 *                   room_id:
 *                     type: integer
 *                     description: The ID of the room related to the feedback.
 *                     example: 202
 *                   comment:
 *                     type: string
 *                     description: The feedback comment.
 *                     example: "Great service!"
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: The date and time when the feedback was created.
 *                     example: "2023-10-01T12:34:56Z"
 *       500:
 *         description: An error occurred while fetching feedback.
 */ 