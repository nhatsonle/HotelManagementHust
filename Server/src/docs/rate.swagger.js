/**
 * @swagger
 * components:
 *   schemas:
 *     Rate:
 *       type: object
 *       required:
 *         - deal_name
 *         - type_id
 *         - discount
 *         - deal_price
 *         - start_date
 *         - end_date
 *         - availability
 *         - cancellation_policy
 *       properties:
 *         rate_id:
 *           type: integer
 *           description: The auto-generated id of the rate
 *         deal_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Name of the deal/rate
 *         type_id:
 *           type: integer
 *           minimum: 1
 *           description: ID of the room type this rate applies to
 *         discount:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *         deal_price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Special price for this deal
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the deal
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the deal
 *         availability:
 *           type: integer
 *           minimum: 0
 *           description: Number of rooms available at this rate
 *         cancellation_policy:
 *           type: string
 *           maxLength: 50
 *           description: Cancellation policy for this rate
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the rate was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the rate was last updated
 *       example:
 *         rate_id: 1
 *         deal_name: "Summer Special"
 *         type_id: 1
 *         discount: 20.00
 *         deal_price: 800.00
 *         start_date: "2024-06-01"
 *         end_date: "2024-08-31"
 *         availability: 10
 *         cancellation_policy: "Free cancellation up to 24h before"
 *         created_at: "2024-03-15T10:00:00Z"
 *         updated_at: "2024-03-15T10:00:00Z"
 * 
 *     RateUpdate:
 *       type: object
 *       properties:
 *         deal_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Name of the deal/rate
 *         type_id:
 *           type: integer
 *           minimum: 1
 *           description: ID of the room type this rate applies to
 *         discount:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *         deal_price:
 *           type: number
 *           format: float
 *           minimum: 0
 *           description: Special price for this deal
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the deal
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the deal
 *         availability:
 *           type: integer
 *           minimum: 0
 *           description: Number of rooms available at this rate
 *         cancellation_policy:
 *           type: string
 *           maxLength: 50
 *           description: Cancellation policy for this rate
 *       example:
 *         deal_name: "Summer Special Updated"
 *         discount: 25.00
 *         availability: 15
 * 
 *     RateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the request was successful
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Rate'
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
 *     RateFilters:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Page number for pagination
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           description: Number of records per page
 *         sort:
 *           type: string
 *           enum: [deal_name, -deal_name, deal_price, -deal_price, discount, -discount, start_date, -start_date, end_date, -end_date, availability, -availability]
 *           default: -rate_id
 *           description: Field to sort by (prefix with - for descending)
 *         deal_name:
 *           type: string
 *           description: Exact match for deal name
 *         deal_name_like:
 *           type: string
 *           description: Partial match for deal name
 *         type_id:
 *           type: integer
 *           minimum: 1
 *           description: Filter by room type ID
 *         min_discount:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Minimum discount percentage
 *         max_discount:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Maximum discount percentage
 *         min_price:
 *           type: number
 *           minimum: 0
 *           description: Minimum deal price
 *         max_price:
 *           type: number
 *           minimum: 0
 *           description: Maximum deal price
 *         start_date_after:
 *           type: string
 *           format: date
 *           description: Filter rates starting after this date
 *         start_date_before:
 *           type: string
 *           format: date
 *           description: Filter rates starting before this date
 *         end_date_after:
 *           type: string
 *           format: date
 *           description: Filter rates ending after this date
 *         end_date_before:
 *           type: string
 *           format: date
 *           description: Filter rates ending before this date
 *         min_availability:
 *           type: integer
 *           minimum: 0
 *           description: Minimum number of available rooms
 *         max_availability:
 *           type: integer
 *           minimum: 0
 *           description: Maximum number of available rooms
 *         cancellation_policy:
 *           type: string
 *           description: Filter by cancellation policy
 *         active:
 *           type: boolean
 *           description: Filter by active status (current date between start and end dates)
 * 
 * @swagger
 * tags:
 *   name: Rates
 *   description: Rate and special deals management API
 */

/**
 * @swagger
 * /api/rates:
 *   get:
 *     summary: Get all rates with filtering and pagination
 *     tags: [Rates]
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
 *           enum: [deal_name, -deal_name, deal_price, -deal_price, discount, -discount, start_date, -start_date, end_date, -end_date, availability, -availability]
 *           default: -rate_id
 *         description: Sort field and direction
 *       - in: query
 *         name: deal_name
 *         schema:
 *           type: string
 *         description: Filter by exact deal name
 *       - in: query
 *         name: deal_name_like
 *         schema:
 *           type: string
 *         description: Filter by partial deal name
 *       - in: query
 *         name: type_id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter by room type ID
 *       - in: query
 *         name: min_discount
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Minimum discount percentage
 *       - in: query
 *         name: max_discount
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *         description: Maximum discount percentage
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum deal price
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum deal price
 *       - in: query
 *         name: start_date_after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rates starting after this date
 *       - in: query
 *         name: start_date_before
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rates starting before this date
 *       - in: query
 *         name: end_date_after
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rates ending after this date
 *       - in: query
 *         name: end_date_before
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter rates ending before this date
 *       - in: query
 *         name: min_availability
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum number of available rooms
 *       - in: query
 *         name: max_availability
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum number of available rooms
 *       - in: query
 *         name: cancellation_policy
 *         schema:
 *           type: string
 *         description: Filter by cancellation policy
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of rates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RateResponse'
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
 *                       example: 400
 *       500:
 *         description: Server error
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
 *                       example: Something went wrong!
 *                     status:
 *                       type: integer
 *                       example: 500
 * 
 *   post:
 *     summary: Create a new rate
 *     tags: [Rates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rate'
 *     responses:
 *       201:
 *         description: Rate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Rate'
 *                 message:
 *                   type: string
 *                   example: Rate created successfully
 *       400:
 *         description: Invalid request body
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
 *                       example: 400
 *       500:
 *         description: Server error
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
 *                       example: Something went wrong!
 *                     status:
 *                       type: integer
 *                       example: 500
 * 
 * @swagger
 * /api/rates/{id}:
 *   get:
 *     summary: Get a rate by ID
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rate ID
 *     responses:
 *       200:
 *         description: Rate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Rate'
 *       404:
 *         description: Rate not found
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
 *                       example: Rate not found
 *                     status:
 *                       type: integer
 *                       example: 404
 *       500:
 *         description: Server error
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
 *                       example: Something went wrong!
 *                     status:
 *                       type: integer
 *                       example: 500
 * 
 *   put:
 *     summary: Update a rate by ID
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RateUpdate'
 *           example:
 *             deal_name: "Summer Special Updated"
 *             discount: 25.00
 *             availability: 15
 *     responses:
 *       200:
 *         description: Rate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Rate'
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Rate not found
 *       500:
 *         description: Server error
 * 
 *   delete:
 *     summary: Delete a rate by ID
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Rate ID
 *     responses:
 *       200:
 *         description: Rate deleted successfully
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
 *                   example: Rate deleted successfully
 *       404:
 *         description: Rate not found
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
 *                       example: Rate not found
 *                     status:
 *                       type: integer
 *                       example: 404
 *       500:
 *         description: Server error
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
 *                       example: Something went wrong!
 *                     status:
 *                       type: integer
 *                       example: 500
 */ 
