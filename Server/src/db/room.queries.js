const db = require('./index');

const getRooms = async ({floor, status}) => {
  let sql = `SELECT * FROM rooms`;
  const conditions = [];
  const params = [];

  if (floor !== undefined) {
    params.push(floor);
    conditions.push(`room_floor = $${params.length}`);
  }
  if (status !== undefined) {
    params.push(status);
    conditions.push(`room_status = $${params.length}`);
  }
  if (conditions.length) sql += ` WHERE ` + conditions.join(' AND ');
  sql += ` ORDER BY room_number`;

  const { rows } = await db.query(sql, params);
  return rows;

};

const getRoomById = async (id) => {
  const query = 'SELECT * FROM rooms WHERE room_id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};


const createRoom = async (roomData) => {
  const { 
    room_number, 
    bed_type, 
    room_floor, 
    room_facility, 
    room_status, 
    type_id, 
    adult_number, 
    child_number 
  } = roomData;
  
  const query = `
    INSERT INTO rooms (
      room_number, 
      bed_type, 
      room_floor, 
      room_facility, 
      room_status, 
      type_id, 
      adult_number, 
      child_number
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  
  const values = [
    room_number, 
    bed_type, 
    room_floor, 
    room_facility, 
    room_status, 
    type_id, 
    adult_number, 
    child_number
  ];
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updateRoom = async (id, roomData) => {
  const { 
    room_number, 
    bed_type, 
    room_floor, 
    room_facility, 
    room_status, 
    type_id, 
    adult_number, 
    child_number 
  } = roomData;
  
  const query = `
    UPDATE rooms
    SET 
      room_number = $1,
      bed_type = $2,
      room_floor = $3,
      room_facility = $4,
      room_status = $5,
      type_id = $6,
      adult_number = $7,
      child_number = $8
    WHERE room_id = $9
    RETURNING *
  `;
  
  const values = [
    room_number, 
    bed_type, 
    room_floor, 
    room_facility, 
    room_status, 
    type_id, 
    adult_number, 
    child_number,
    id
  ];
  
  const { rows } = await db.query(query, values);
  return rows[0];
};

const updateRoomStatus = async (id, { room_status }) => {
  const query = 'UPDATE rooms SET room_status = $1 WHERE room_id = $2 RETURNING *';
  const { rows } = await db.query(query, [room_status, id]);
  return rows[0];
};

const deleteRoom = async (id) => {
  const query = 'DELETE FROM rooms WHERE room_id = $1';
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






