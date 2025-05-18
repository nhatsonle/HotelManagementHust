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
 *         roomType:
 *           type: object
 *           description: Associated room type information
 *           properties:
 *             type_id:
 *               type: integer
 *               description: The ID of the room type
 *             type_name:
 *               type: string
 *               description: Name of the room type
 *             base_price:
 *               type: number
 *               format: float
 *               description: Base price for this room type
 *             cancellation_policy:
 *               type: string
 *               description: Cancellation policy for this room type
 *       example:
 *         room_number: "101"
 *         bed_type: "King Size"
 *         room_floor: 1
 *         room_facility: "WiFi, TV, Mini Bar"
 *         room_status: "Available"
 *         type_id: 1
 *         adult_number: 2
 *         child_number: 1
 *         roomType:
 *           type_id: 1
 *           type_name: "Deluxe Suite"
 *           base_price: 150.00
 *           cancellation_policy: "24 hours before check-in"
 * 
 *     RoomResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Room'
 *         meta:
 *           type: object
 *           properties:
 *             pagination:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of records
 *                 page:
 *                   type: integer
 *                   description: Current page number
 *                 limit:
 *                   type: integer
 *                   description: Number of records per page
 *                 totalPages:
 *                   type: integer
 *                   description: Total number of pages
 *             filters:
 *               type: object
 *               description: Applied filters
 *             sort:
 *               type: string
 *               description: Current sort field and direction
 * 
 *     RoomFilters:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Page number
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Number of records per page
 *         sort:
 *           type: string
 *           enum: [room_number, -room_number, room_floor, -room_floor, adult_number, -adult_number, child_number, -child_number]
 *           default: -room_id
 *           description: Sort field (prefix with - for descending)
 *         room_number:
 *           type: string
 *           description: Filter by exact room number
 *         bed_type:
 *           type: string
 *           description: Filter by bed type
 *         room_status:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *           description: Filter by room status
 *         type_id:
 *           type: integer
 *           description: Filter by room type ID
 *         floor_min:
 *           type: integer
 *           minimum: 1
 *           description: Minimum floor number
 *         floor_max:
 *           type: integer
 *           minimum: 1
 *           description: Maximum floor number
 *         adult_min:
 *           type: integer
 *           minimum: 1
 *           description: Minimum adult capacity
 *         adult_max:
 *           type: integer
 *           minimum: 1
 *           description: Maximum adult capacity
 *         child_min:
 *           type: integer
 *           minimum: 0
 *           description: Minimum child capacity
 *         child_max:
 *           type: integer
 *           minimum: 0
 *           description: Maximum child capacity
 *         room_number_like:
 *           type: string
 *           description: Filter by partial room number match
 *         facility_like:
 *           type: string
 *           description: Filter by partial facility match
 *         status_in:
 *           type: string
 *           description: Filter by multiple statuses (comma-separated)
 *         type_id_in:
 *           type: string
 *           description: Filter by multiple type IDs (comma-separated)
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
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of records per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [room_number, -room_number, room_floor, -room_floor, adult_number, -adult_number, child_number, -child_number]
 *           default: -room_id
 *         description: Sort field (prefix with - for descending)
 *       - in: query
 *         name: room_number
 *         schema:
 *           type: string
 *         description: Filter by exact room number
 *       - in: query
 *         name: bed_type
 *         schema:
 *           type: string
 *         description: Filter by bed type
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
 *         name: floor_min
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum floor number
 *       - in: query
 *         name: floor_max
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum floor number
 *       - in: query
 *         name: adult_min
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum adult capacity
 *       - in: query
 *         name: adult_max
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum adult capacity
 *       - in: query
 *         name: child_min
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum child capacity
 *       - in: query
 *         name: child_max
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum child capacity
 *       - in: query
 *         name: room_number_like
 *         schema:
 *           type: string
 *         description: Filter by partial room number match
 *       - in: query
 *         name: facility_like
 *         schema:
 *           type: string
 *         description: Filter by partial facility match
 *       - in: query
 *         name: status_in
 *         schema:
 *           type: string
 *         description: Filter by multiple statuses (comma-separated)
 *       - in: query
 *         name: type_id_in
 *         schema:
 *           type: string
 *         description: Filter by multiple type IDs (comma-separated)
 *     responses:
 *       200:
 *         description: The list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomResponse'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     status:
 *                       type: integer
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
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 message:
 *                   type: string
 *                   example: Room created successfully
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                     status:
 *                       type: integer
 * 
 * /api/rooms/{id}:
 *   get:
 *     summary: Get a room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Room not found
 *                     status:
 *                       type: integer
 *                       example: 404
 * 
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 message:
 *                   type: string
 *                   example: Room updated successfully
 *       404:
 *         description: Room not found
 *       400:
 *         description: Invalid input data
 * 
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Room deleted successfully
 *       404:
 *         description: Room not found
 * 
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room ID
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Available, Booked, Reserved, Cleaning, Maintenance]
 *         description: New room status
 *     responses:
 *       200:
 *         description: Room status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *                 message:
 *                   type: string
 *                   example: Room status updated successfully
 *       404:
 *         description: Room not found
 *       400:
 *         description: Invalid status
 */ 