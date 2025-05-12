const db = require('./index');

const getRooms = async (filters = {}) => {
  const query = 'SELECT * FROM rooms';
  const { rows } = await db.query(query);
  return rows;
};

const getRoomById = async (id) => {
  const query = 'SELECT * FROM rooms WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const createRoom = async (roomData) => {
  const { room_number, type, status, price } = roomData;
  const query = `
    INSERT INTO rooms (room_number, type, status, price)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [room_number, type, status, price];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updateRoom = async (id, roomData) => {
  const { room_number, type, status, price } = roomData;
  const query = `
    UPDATE rooms
    SET room_number = $1, type = $2, status = $3, price = $4
    WHERE id = $5
    RETURNING *
  `;
  const values = [room_number, type, status, price, id];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updateRoomStatus = async (id, { status }) => {
  const query = 'UPDATE rooms SET status = $1 WHERE id = $2 RETURNING *';
  const { rows } = await db.query(query, [status, id]);
  return rows[0];
};

const deleteRoom = async (id) => {
  const query = 'DELETE FROM rooms WHERE id = $1';
  await db.query(query, [id]);
};

module.exports = {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom
};






