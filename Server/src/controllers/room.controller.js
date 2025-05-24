// Xử lý logic request/response cho phòng
const roomService = require('../services/room.service');
const { ValidationError } = require('sequelize');
const createError = require('http-errors');

// Helper function to handle errors
const handleError = (err, next) => {
  if (err instanceof ValidationError) {
    return next(createError(400, err.message));
  }
  if (err.isJoi) {
    return next(createError(400, err.message));
  }
  return next(err);
};

exports.getRooms = async (req, res, next) => {
  try {
    const { rows, count } = await roomService.getRooms(req.query);
    
    // Build filter metadata
    const appliedFilters = {};
    Object.entries(req.query).forEach(([key, value]) => {
      if (!['page', 'limit', 'sort'].includes(key)) {
        appliedFilters[key] = value;
      }
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        pagination: {
          total: count,
          page: parseInt(req.query.page) || 1,
          limit: parseInt(req.query.limit) || 10,
          totalPages: Math.ceil(count / (parseInt(req.query.limit) || 10))
        },
        filters: appliedFilters,
        sort: req.query.sort || '-room_id'
      }
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);

    if (!room) {
      throw createError(404, 'Room not found');
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json({
      success: true,
      data: newRoom,
      message: 'Room created successfully'
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await roomService.updateRoom(id, req.body);

    if (!updated) {
      throw createError(404, 'Room not found');
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Room updated successfully'
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!status) {
      throw createError(400, 'Status is required');
    }

    const updated = await roomService.updateRoomStatus(id, status);
    if (!updated) {
      throw createError(404, 'Room not found');
    }

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Room status updated successfully'
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await roomService.deleteRoom(id);

    if (!deleted) {
      throw createError(404, 'Room not found');
    }

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (err) {
    handleError(err, next);
  }
};

exports.getAvailableRooms = async (req, res, next) => {
  try {
    const { checkin, checkout, adult, child } = req.query;

    if (!checkin || !checkout || !adult || !child) {
      throw createError(400, 'Missing required parameters: checkin, checkout, adult, child');
    }

    const rooms = await roomService.getAvailableRooms(checkin, checkout, adult, child);

    res.status(200).json({
      success: true,
      data: rooms,
      meta: {
        filters: {
          checkin,
          checkout,
          adult,
          child
        }
      }
    });
  } catch (err) {
    handleError(err, next);
  }
};







