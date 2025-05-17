// Xử lý logic request/response cho giá/khuyến mãi
const rateService = require('../services/rate.service');

// Helper function to handle errors
const handleError = (error, res) => {
  if (error.isJoi) {
    return res.status(400).json({
      success: false,
      error: {
        message: error.details[0].message,
        status: 400
      }
    });
  }

  if (error.message === 'Rate not found') {
    return res.status(404).json({
      success: false,
      error: {
        message: error.message,
        status: 404
      }
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      message: 'Something went wrong!',
      status: 500
    }
  });
};

class RateController {
  async getRates(req, res) {
    try {
      const result = await rateService.getRates(req.query);
      
      // Build applied filters object (excluding pagination and sorting)
      const { page, limit, sort, ...appliedFilters } = req.query;
      
      return res.json({
        success: true,
        data: result.data,
        meta: {
          ...result.meta,
          filters: appliedFilters
        }
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async getRateById(req, res) {
    try {
      const rate = await rateService.getRateById(req.params.id);
      return res.json({
        success: true,
        data: rate
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async createRate(req, res) {
    try {
      const rate = await rateService.createRate(req.body);
      return res.status(201).json({
        success: true,
        data: rate,
        message: 'Rate created successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateRate(req, res) {
    try {
      const rate = await rateService.updateRate(req.params.id, req.body);
      return res.json({
        success: true,
        data: rate,
        message: 'Rate updated successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async deleteRate(req, res) {
    try {
      await rateService.deleteRate(req.params.id);
      return res.json({
        success: true,
        message: 'Rate deleted successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

module.exports = new RateController();
