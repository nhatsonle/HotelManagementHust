const db = require('./index');

const getRooms = async (filters) => {
  let sql = 'SELECT * FROM rooms';
  const where = [];
  const params = [];

  //  equal 
  for (const [col, val] of Object.entries(filters.equal)) {
    params.push(val);
    where.push(`${col} = $${params.length}`);
  }

  //  like 
  for (const [col, val] of Object.entries(filters.like)) {
    params.push(`%${val}%`);
    where.push(`${col} ILIKE $${params.length}`);
  }

  //  between 
  for (const [col, r] of Object.entries(filters.range)) {
    params.push(r.min, r.max);
    where.push(`${col} BETWEEN $${params.length - 1} AND $${params.length}`);
  }

  // ========== greater-than ==========
  for (const [col, val] of Object.entries(filters.gt ?? {})) {
    params.push(val);
    where.push(`${col} > $${params.length}`);
  }

  // ========== less-than ==========
  for (const [col, val] of Object.entries(filters.lt ?? {})) {
    params.push(val);
    where.push(`${col} < $${params.length}`);
  }

  if (where.length) sql += ' WHERE ' + where.join(' AND ');

  //  order 
  if (filters.orderBy)
    sql += ` ORDER BY ${filters.orderBy.field} ${filters.orderBy.dir}`;

  //  pagination 
  sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(filters.limit, filters.offset);

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






