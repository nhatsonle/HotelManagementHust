// Xử lý logic request/response cho phòng
const roomService = require('../services/room.service');

exports.getRooms = async (req, res, next) => {
  try {
    const { floor, status } = req.query;
    const rooms = await roomService.getRooms({ floor, status });
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await roomService.getRoomById(req.params.id);
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const room = await roomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await roomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.updateRoomStatus = async (req, res, next) => {
  try {
    const room = await roomService.updateRoomStatus(req.params.id, req.body);
    res.json(room);
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    await roomService.deleteRoom(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};





