// Chứa business logic chính của ứng dụng cho phòng
const roomQueries = require('../db/room.queries');

exports.getAllRooms = async (filters) => {
  // xử lý filters nếu có
  return await roomQueries.getRooms(filters);
};

exports.getRoomById = async (id) => {
  return await roomQueries.getRoomById(id);
};

exports.createRoom = async (roomData) => {
  return await roomQueries.createRoom(roomData);
};

exports.updateRoom = async (id, roomData) => {
  return await roomQueries.updateRoom(id, roomData);
};

exports.updateRoomStatus = async (id, status) => {
  return await roomQueries.updateRoomStatus(id, status);
};

exports.deleteRoom = async (id) => {
  return await roomQueries.deleteRoom(id);
};









