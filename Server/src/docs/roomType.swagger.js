/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       required:
 *         - type_name
 *         - base_price
 *       properties:
 *         type_id:
 *           type: integer
 *           description: The auto-generated id of the room type
 *         type_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Name of the room type
 *         base_price:
 *           type: number
 *           minimum: 0
 *           description: Base price for this room type
 *         cancellation_policy:
 *           type: string
 *           maxLength: 255
 *           description: Cancellation policy for this room type
 *       example:
 *         type_name: "Deluxe"
 *         base_price: 150.00
 *         cancellation_policy: "Free cancellation up to 24 hours before check-in"
 * 
 * @swagger
 * tags:
 *   name: RoomTypes
 *   description: Room type management API
 */

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Returns the list of all room types
 *     tags: [RoomTypes]
 *     responses:
 *       200:
 *         description: The list of room types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomType'
 * 
 *   post:
 *     summary: Create a new room type
 *     tags: [RoomTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       201:
 *         description: The room type was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomType'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/room-types/{id}:
 *   get:
 *     summary: Get a room type by id
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type id
 *     responses:
 *       200:
 *         description: The room type description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: The room type was not found
 * 
 *   put:
 *     summary: Update a room type by id
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       200:
 *         description: The room type was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: The room type was not found
 *       400:
 *         description: Invalid input data
 * 
 *   delete:
 *     summary: Delete a room type by id
 *     tags: [RoomTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room type id
 *     responses:
 *       204:
 *         description: The room type was deleted
 *       404:
 *         description: The room type was not found
 */ 