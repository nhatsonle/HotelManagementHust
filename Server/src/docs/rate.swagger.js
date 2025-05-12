/**
 * @swagger
 * components:
 *   schemas:
 *     Rate:
 *       type: object
 *       required:
 *         - type_id
 *         - deal_name
 *         - deal_price
 *         - availability
 *         - start_date
 *         - end_date
 *         - discount
 *       properties:
 *         rate_id:
 *           type: integer
 *           description: The auto-generated id of the rate
 *         type_id:
 *           type: integer
 *           minimum: 1
 *           description: ID of the room type this rate applies to
 *         deal_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 120
 *           description: Name of the special deal/rate
 *         deal_price:
 *           type: number
 *           minimum: 0
 *           description: Special price for this deal
 *         cancellation_policy:
 *           type: string
 *           maxLength: 255
 *           description: Cancellation policy for this rate
 *         availability:
 *           type: integer
 *           minimum: 0
 *           description: Number of rooms available at this rate
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: Start date of the rate validity
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: End date of the rate validity
 *         discount:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           description: Discount percentage
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the rate was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the rate was last updated
 *       example:
 *         type_id: 1
 *         deal_name: "Summer Special"
 *         deal_price: 120.00
 *         cancellation_policy: "Free cancellation up to 48 hours before check-in"
 *         availability: 5
 *         start_date: "2024-06-01T00:00:00Z"
 *         end_date: "2024-08-31T23:59:59Z"
 *         discount: 20
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
 *     summary: Returns the list of all rates
 *     tags: [Rates]
 *     responses:
 *       200:
 *         description: The list of rates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rate'
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
 *         description: The rate was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/rates/{id}:
 *   get:
 *     summary: Get a rate by id
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The rate id
 *     responses:
 *       200:
 *         description: The rate description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 *       404:
 *         description: The rate was not found
 * 
 *   put:
 *     summary: Update a rate by id
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The rate id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rate'
 *     responses:
 *       200:
 *         description: The rate was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rate'
 *       404:
 *         description: The rate was not found
 *       400:
 *         description: Invalid input data
 * 
 *   delete:
 *     summary: Delete a rate by id
 *     tags: [Rates]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The rate id
 *     responses:
 *       204:
 *         description: The rate was deleted
 *       404:
 *         description: The rate was not found
 */ 