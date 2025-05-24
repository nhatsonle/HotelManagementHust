/**
 * @swagger
 * components:
 *   schemas:
 *     RoomType:
 *       type: object
 *       required:
 *         - type_name
 *         - base_price
 *         - cancellation_policy
 *       properties:
 *         type_id:
 *           type: integer
 *           description: The auto-generated id of the room type
 *         type_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           description: Name of the room type
 *         base_price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Base price for this room type
 *         cancellation_policy:
 *           type: string
 *           maxLength: 50
 *           description: Cancellation policy for this room type
 *       example:
 *         type_name: "Deluxe Suite"
 *         base_price: 150.00
 *         cancellation_policy: "24 hours before check-in"
 * 
 *     RoomTypeResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoomType'
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
 *     RoomTypeFilters:
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
 *           enum: [type_name, -type_name, base_price, -base_price]
 *           default: -type_id
 *           description: Sort field (prefix with - for descending)
 *         type_name:
 *           type: string
 *           description: Filter by exact type name
 *         type_name_like:
 *           type: string
 *           description: Filter by partial type name match
 *         min_price:
 *           type: number
 *           minimum: 0
 *           description: Minimum base price
 *         max_price:
 *           type: number
 *           minimum: 0
 *           description: Maximum base price
 *         cancellation_policy:
 *           type: string
 *           description: Filter by cancellation policy
 * 
 * @swagger
 * tags:
 *   name: Room Types
 *   description: Room type management API
 */

/**
 * @swagger
 * /api/room-types:
 *   get:
 *     summary: Returns the list of all room types
 *     tags: [Room Types]
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
 *           enum: [type_name, -type_name, base_price, -base_price]
 *           default: -type_id
 *         description: Sort field (prefix with - for descending)
 *       - in: query
 *         name: type_name
 *         schema:
 *           type: string
 *         description: Filter by exact type name
 *       - in: query
 *         name: type_name_like
 *         schema:
 *           type: string
 *         description: Filter by partial type name match
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum base price
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum base price
 *       - in: query
 *         name: cancellation_policy
 *         schema:
 *           type: string
 *         description: Filter by cancellation policy
 *     responses:
 *       200:
 *         description: The list of room types
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoomTypeResponse'
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
 * 
 *   post:
 *     summary: Create a new room type
 *     tags: [Room Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       201:
 *         description: Room type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoomType'
 *                 message:
 *                   type: string
 *                   example: Room type created successfully
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
 * /api/room-types/{id}:
 *   get:
 *     summary: Get a room type by ID
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoomType'
 *       404:
 *         description: Room type not found
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
 *                       example: Room type not found
 *                     status:
 *                       type: integer
 *                       example: 404
 * 
 *   put:
 *     summary: Update a room type
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoomType'
 *     responses:
 *       200:
 *         description: Room type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/RoomType'
 *                 message:
 *                   type: string
 *                   example: Room type updated successfully
 *       404:
 *         description: Room type not found
 *       400:
 *         description: Invalid input data
 * 
 *   delete:
 *     summary: Delete a room type
 *     tags: [Room Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Room type ID
 *     responses:
 *       200:
 *         description: Room type deleted successfully
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
 *                   example: Room type deleted successfully
 *       404:
 *         description: Room type not found
 */ 