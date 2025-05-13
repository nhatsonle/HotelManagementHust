// Xử lý logic request/response cho phòng
const roomService = require('../services/room.service');

exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms(req.query);
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};


exports.getRoomById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await roomService.getRoomById(id);

    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};


exports.createRoom = async (req, res, next) => {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (err) {
    next(err);
  }
};


exports.updateRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await roomService.updateRoom(id, req.body);

    if (!updated) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};


exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const updated = await roomService.updateRoomStatus(id, status);
    if (!updated) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};


exports.deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await roomService.deleteRoom(id);

    if (!deleted) return res.status(404).json({ message: 'Room not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};






