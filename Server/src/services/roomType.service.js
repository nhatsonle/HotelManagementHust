// Chứa business logic cho loại phòng
const roomTypeQueries = require('../db/roomType.queries');
const Joi = require('joi');

// Schema validate đầu vào
const schema = Joi.object({
  type_name: Joi.string().trim().min(2).max(100).required(),
  base_price: Joi.number().min(0).required(),
  cancellation_policy: Joi.string().trim().max(255).allow(null, ''),
});

exports.getRoomTypes     = () => roomTypeQueries.getRoomTypes();
exports.getRoomTypeById  = (id) => roomTypeQueries.getRoomTypeById(id);

exports.createRoomType = async (data) => {
  const value = await schema.validateAsync(data);
  return roomTypeQueries.createRoomType(value);
};

exports.updateRoomType = async (id, data) => {
  const value = await schema.validateAsync(data);
  return roomTypeQueries.updateRoomType(id, value);
};

exports.deleteRoomType = (id) => roomTypeQueries.deleteRoomType(id);
