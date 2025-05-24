// Xử lý logic request/response cho loại phòng
const roomTypeService = require('../services/roomType.service');

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

  if (error.message === 'Room type not found') {
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

class RoomTypeController {
  async getRoomTypes(req, res) {
    try {
      const result = await roomTypeService.getRoomTypes(req.query);
      
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

  async getRoomTypeById(req, res) {
    try {
      const roomType = await roomTypeService.getRoomTypeById(req.params.id);
      return res.json({
        success: true,
        data: roomType
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async createRoomType(req, res) {
    try {
      const roomType = await roomTypeService.createRoomType(req.body);
      return res.status(201).json({
        success: true,
        data: roomType,
        message: 'Room type created successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async updateRoomType(req, res) {
    try {
      const roomType = await roomTypeService.updateRoomType(req.params.id, req.body);
      return res.json({
        success: true,
        data: roomType,
        message: 'Room type updated successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }

  async deleteRoomType(req, res) {
    try {
      await roomTypeService.deleteRoomType(req.params.id);
      return res.json({
        success: true,
        message: 'Room type deleted successfully'
      });
    } catch (error) {
      handleError(error, res);
    }
  }
}

module.exports = new RoomTypeController();
