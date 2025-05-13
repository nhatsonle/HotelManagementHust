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
 *         - room_status
 *         - type_id
 *         - adult_number
 *         - child_number
 *       properties:
 *         room_id:
 *           type: integer
 *           description: The auto-generated id of the room
 *         room_number:
 *           type: string
 *           minLength: 1
 *           maxLength: 10
 *           description: The room number
 *         bed_type:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Type of bed in the room
 *         room_floor:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Floor number where the room is located
 *         room_facility:
 *           type: string
 *           maxLength: 500
 *           description: Facilities available in the room
 *         room_status:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *           description: Current status of the room
 *         type_id:
 *           type: integer
 *           minimum: 1
 *           description: ID of the room type
 *         adult_number:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *           description: Maximum number of adults allowed
 *         child_number:
 *           type: integer
 *           minimum: 0
 *           maximum: 10
 *           description: Maximum number of children allowed
 *       example:
 *         room_number: "101"
 *         bed_type: "King Size"
 *         room_floor: 1
 *         room_facility: "WiFi, TV, Mini Bar"
 *         room_status: "Available"
 *         type_id: 1
 *         adult_number: 2
 *         child_number: 1
 * 
 *     RoomStatus:
 *       type: object
 *       required:
 *         - room_status
 *       properties:
 *         room_status:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *           description: New status of the room
 *       example:
 *         room_status: "Booked"
 * 
 *     RoomFilters:
 *       type: object
 *       properties:
 *         room_id:
 *           type: integer
 *           description: Filter by room ID
 *         room_number:
 *           type: string
 *           description: Filter by exact room number
 *         room_number_like:
 *           type: string
 *           description: Filter by partial room number match
 *         bed_type:
 *           type: string
 *           description: Filter by bed type
 *         room_floor:
 *           type: integer
 *           description: Filter by floor number
 *         room_status:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *           description: Filter by room status
 *         type_id:
 *           type: integer
 *           description: Filter by room type ID
 *         facility_like:
 *           type: string
 *           description: Filter by partial facility match
 *         adult_min:
 *           type: integer
 *           description: Minimum adult capacity
 *         adult_max:
 *           type: integer
 *           description: Maximum adult capacity
 *         child_min:
 *           type: integer
 *           description: Minimum child capacity
 *         child_max:
 *           type: integer
 *           description: Maximum child capacity
 *         floor_gt:
 *           type: integer
 *           description: Filter rooms above this floor
 *         floor_lt:
 *           type: integer
 *           description: Filter rooms below this floor
 *         sort:
 *           type: string
 *           description: Sort field (prefix with - for descending)
 *         limit:
 *           type: integer
 *           description: Number of records per page
 *         page:
 *           type: integer
 *           description: Page number
 * 
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
 *         name: room_id
 *         schema:
 *           type: integer
 *         description: Filter by room ID
 *       - in: query
 *         name: room_number
 *         schema:
 *           type: string
 *         description: Filter by exact room number
 *       - in: query
 *         name: room_number_like
 *         schema:
 *           type: string
 *         description: Filter by partial room number match
 *       - in: query
 *         name: bed_type
 *         schema:
 *           type: string
 *         description: Filter by bed type
 *       - in: query
 *         name: room_floor
 *         schema:
 *           type: integer
 *         description: Filter by floor number
 *       - in: query
 *         name: room_status
 *         schema:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *         description: Filter by room status
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *         description: Filter by room type ID
 *       - in: query
 *         name: facility_like
 *         schema:
 *           type: string
 *         description: Filter by partial facility match
 *       - in: query
 *         name: adult_min
 *         schema:
 *           type: integer
 *         description: Minimum adult capacity
 *       - in: query
 *         name: adult_max
 *         schema:
 *           type: integer
 *         description: Maximum adult capacity
 *       - in: query
 *         name: child_min
 *         schema:
 *           type: integer
 *         description: Minimum child capacity
 *       - in: query
 *         name: child_max
 *         schema:
 *           type: integer
 *         description: Maximum child capacity
 *       - in: query
 *         name: floor_gt
 *         schema:
 *           type: integer
 *         description: Filter rooms above this floor
 *       - in: query
 *         name: floor_lt
 *         schema:
 *           type: integer
 *         description: Filter rooms below this floor
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (prefix with - for descending)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
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
 *       400:
 *         description: Invalid input data
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *         required: true
 *         description: New status of the room
 *     responses:
 *       200:
 *         description: The room status was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The room was not found
 *       400:
 *         description: Invalid status value
 */ 