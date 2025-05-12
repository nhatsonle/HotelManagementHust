// Chứa business logic chính của ứng dụng cho phòng
const roomQueries = require('../db/room.queries');
const ALLOWED_STATUS = ['Available', 'Booked', 'Reserved', 'Cleaning', 'Maintenance'];

exports.getRooms = async ({floor, status}) => {
  // xử lý filters
  const filters = {}; 
  if (floor) {
    const parsed = parseInt(floor, 10);
    if (Number.isNaN(parsed) || parsed < 0) throw new Error('Invalid floor');
    filters.floor = parsed;
  }
  if (status) {
    if (!ALLOWED_STATUS.includes(status)) throw new Error('Invalid status');
    filters.status = status;
  }
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









