
// Thêm phòng mới
const CREATE_ROOM = `
  INSERT INTO rooms (type_id, room_number, bed_type, room_floor, room_facility, room_status)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;

// Lấy danh sách phòng
const GET_ROOMS = `
  SELECT * 
  FROM rooms
  ORDER BY room_id ASC;
`;

// Cập nhật phòng
const UPDATE_ROOM = `
  UPDATE rooms
  SET 
    type_id     = $2,
    room_number = $3,
    bed_type    = $4,
    room_floor  = $5,
    room_facility = $6,
    room_status = $7
  WHERE room_id = $1
  RETURNING *;
`;

// Cập nhật trạng thái phòng
const UPDATE_ROOM_STATUS = `
  UPDATE rooms
  SET room_status = $2
  WHERE room_id = $1
  RETURNING *;
`;

// Xóa phòng
const DELETE_ROOM = `
  DELETE FROM rooms
  WHERE room_id = $1
  RETURNING *;
`;

module.exports = {
  CREATE_ROOM,
  GET_ROOMS,
  UPDATE_ROOM,
  DELETE_ROOM,
  UPDATE_ROOM_STATUS
};