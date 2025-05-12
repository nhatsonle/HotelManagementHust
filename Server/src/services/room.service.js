// Chứa business logic chính của ứng dụng cho phòng
const roomQueries = require('../db/room.queries');
const ALLOWED_STATUS = ['Available', 'Booked', 'Reserved', 'Cleaning', 'Maintenance'];

exports.getRooms = async (query) => {
  const filters = {
    // so sánh bằng
    equal: {},
    // LIKE mờ
    like: {},
    // BETWEEN
    range: {},
    // lớn hơn
    gt: {},
    // nhỏ hơn
    lt: {},
    // sort + pagination
    orderBy: null,
    limit: 10,
    offset: 0,
  };

  //  so sánh bằng 
  ['room_id', 'room_number', 'bed_type', 'room_floor',
   'room_status', 'type_id'].forEach((key) => {
    if (query[key] !== undefined) filters.equal[key] = query[key];
  });

  //  tìm mờ 
  if (query.room_number_like) filters.like.room_number = query.room_number_like;
  if (query.facility_like)     filters.like.room_facility = query.facility_like;

  //  BETWEEN 
  if (query.adult_min || query.adult_max)
    filters.range.adult_number = {
      min: query.adult_min ?? 0,
      max: query.adult_max ?? 99,
    };
  if (query.child_min || query.child_max)
    filters.range.child_number = {
      min: query.child_min ?? 0,
      max: query.child_max ?? 99,
    };
  // ======= floor greater‑than =======
  if (query.floor_gt !== undefined) {
    const val = parseInt(query.floor_gt, 10);
    if (Number.isNaN(val) || val < 0) throw new Error('Invalid floor_gt');
    filters.gt.room_floor = val;  
  }
  // ======= floor less‑than =======
  if (query.floor_lt !== undefined) {
    const val = parseInt(query.floor_lt, 10);
    if (Number.isNaN(val) || val < 0) throw new Error('Invalid floor_lt');
    filters.lt.room_floor = val;         
  }

  //  ORDER BY 
  if (query.sort) {
    const field = query.sort.startsWith('-')
      ? query.sort.slice(1)
      : query.sort;
    const dir = query.sort.startsWith('-') ? 'DESC' : 'ASC';
    filters.orderBy = { field, dir };
  }

  //  pagination 
  const limit = parseInt(query.limit, 10);
  const page  = parseInt(query.page, 10) || 1;
  if (!Number.isNaN(limit) && limit > 0) filters.limit = limit;
  filters.offset = (page - 1) * filters.limit;

  return roomQueries.getRooms(filters);
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









