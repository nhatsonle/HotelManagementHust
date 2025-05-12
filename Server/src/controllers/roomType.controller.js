// Xử lý logic request/response cho loại phòng
const roomTypeService = require('../services/roomType.service');

exports.getRoomTypes = async (req, res, next) => {
  try {
    const list = await roomTypeService.getRoomTypes();
    res.status(200).json(list);
  } catch (err) { next(err); }
};

exports.getRoomTypeById = async (req, res, next) => {
  try {
    const item = await roomTypeService.getRoomTypeById(req.params.id);
    if (!item) return res.status(404).json({ message: 'RoomType not found' });
    res.status(200).json(item);
  } catch (err) { next(err); }
};

exports.createRoomType = async (req, res, next) => {
  try {
    const created = await roomTypeService.createRoomType(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.updateRoomType = async (req, res, next) => {
  try {
    const updated = await roomTypeService.updateRoomType(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'RoomType not found' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
};

exports.deleteRoomType = async (req, res, next) => {
  try {
    const ok = await roomTypeService.deleteRoomType(req.params.id);
    if (!ok) return res.status(404).json({ message: 'RoomType not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
