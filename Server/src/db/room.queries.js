// Hàm thực thi SQL cho Rooms (CRUD phòng)

// Thêm phòng mới
const addRoomQuery = `
  INSERT INTO rooms (name, capacity, amenities)
  VALUES ($1, $2, $3)
  RETURNING *;
`;

// Lấy thông tin phòng theo ID
const getRoomByIdQuery = `
  SELECT * FROM rooms
  WHERE id = $1;
`;

// Cập nhật thông tin phòng
const updateRoomQuery = `
  UPDATE rooms
  SET name = $1, capacity = $2, amenities = $3
  WHERE id = $4
  RETURNING *;
`;

// Xóa phòng theo ID
const deleteRoomQuery = `
  DELETE FROM rooms
  WHERE id = $1
  RETURNING *;
`;

module.exports = {
  addRoomQuery,
  getRoomByIdQuery,
  updateRoomQuery,
  deleteRoomQuery,
};