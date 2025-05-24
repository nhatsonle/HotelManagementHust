// Định nghĩa routes cho quản lý giá/khuyến mãi
const express = require('express');
const router  = express.Router();
const rateController = require('../controllers/rate.controller');

router.route('/')
  .get(rateController.getRates)        // GET  /api/rates
  .post(rateController.createRate);    // POST /api/rates

router.route('/:id')
  .get(rateController.getRateById)     // GET    /api/rates/:id
  .put(rateController.updateRate)      // PUT    /api/rates/:id
  .delete(rateController.deleteRate);  // DELETE /api/rates/:id

module.exports = router;
