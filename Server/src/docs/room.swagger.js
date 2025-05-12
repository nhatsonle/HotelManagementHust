/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - room_number
 *         - bed_type
 *         - room_floor
 *         - room_facility
 *         - room_status
 *         - type_id
 *       properties:
 *         room_id:
 *           type: integer
 *           description: The auto-generated id of the room
 *         room_number:
 *           type: string
 *           description: The room number
 *         bed_type:
 *           type: string
 *           description: Type of bed in the room
 *           enum: [Single, Double, Queen, King]
 *         room_floor:
 *           type: string
 *           description: Floor number where the room is located
 *         room_facility:
 *           type: string
 *           description: Available facilities in the room
 *         room_status:
 *           type: string
 *           description: Current status of the room
 *           enum: [Available, Occupied, Maintenance]
 *         type_id:
 *           type: integer
 *           description: ID of the room type
 *         adult_number:
 *           type: integer
 *           description: Maximum number of adults allowed
 *         child_number:
 *           type: integer
 *           description: Maximum number of children allowed
 *       example:
 *         room_id: 1
 *         room_number: "101"
 *         bed_type: "Queen"
 *         room_floor: "1st"
 *         room_facility: "Air conditioning, Free WiFi"
 *         room_status: "Available"
 *         type_id: 1
 *         adult_number: 2
 *         child_number: 1
 */

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management API
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Returns the list of all rooms
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter rooms by status
 *       - in: query
 *         name: floor
 *         schema:
 *           type: string
 *         description: Filter rooms by floor
 *       - in: query
 *         name: bed_type
 *         schema:
 *           type: string
 *         description: Filter rooms by bed type
 *     responses:
 *       200:
 *         description: The list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: The room was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room id
 *     responses:
 *       200:
 *         description: The room description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The room was not found
 *   put:
 *     summary: Update a room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: The room was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The room was not found
 *   delete:
 *     summary: Delete a room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room id
 *     responses:
 *       204:
 *         description: The room was deleted
 *       404:
 *         description: The room was not found
 */

/**
 * @swagger
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The room id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Available, Occupied, Maintenance]
 *     responses:
 *       200:
 *         description: The room status was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The room was not found
 */ 