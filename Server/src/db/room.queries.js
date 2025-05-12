const db = require('./index');

const SELECT_COLUMNS = `
  room_id, room_number, bed_type, room_floor, room_facility,
  room_status, type_id, adult_number, child_number
`;

exports.getRooms = async (filters) => {
  let sql = `SELECT ${SELECT_COLUMNS} FROM rooms`;
  const where = [];
  const params = [];

  // equal 
  for (const [col, val] of Object.entries(filters.equal)) {
    params.push(val);
    where.push(`${col} = $${params.length}`);
  }

  // like 
  for (const [col, val] of Object.entries(filters.like)) {
    params.push(`%${val}%`);
    where.push(`${col} ILIKE $${params.length}`);
  }

  // between 
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

exports.getRoomById = async (id) => {
  const { rows } = await db.query(
    `SELECT ${SELECT_COLUMNS} FROM rooms WHERE room_id = $1`,
    [id]
  );
  return rows[0];
};

exports.createRoom = async (r) => {
  const { rows } = await db.query(
    `INSERT INTO rooms (
      room_number, bed_type, room_floor, room_facility,
      room_status, type_id, adult_number, child_number
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING ${SELECT_COLUMNS}`,
    [
      r.room_number, r.bed_type, r.room_floor, r.room_facility,
      r.room_status, r.type_id, r.adult_number, r.child_number
    ]
  );
  return rows[0];
};

exports.updateRoom = async (id, r) => {
  const { rows } = await db.query(
    `UPDATE rooms
       SET room_number   = $2,
           bed_type      = $3,
           room_floor    = $4,
           room_facility = $5,
           room_status   = $6,
           type_id       = $7,
           adult_number  = $8,
           child_number  = $9
     WHERE room_id = $1
     RETURNING ${SELECT_COLUMNS}`,
    [
      id, r.room_number, r.bed_type, r.room_floor, r.room_facility,
      r.room_status, r.type_id, r.adult_number, r.child_number
    ]
  );
  return rows[0];
};

exports.updateRoomStatus = async (id, { room_status }) => {
  const { rows } = await db.query(
    `UPDATE rooms
       SET room_status = $2
     WHERE room_id = $1
     RETURNING ${SELECT_COLUMNS}`,
    [id, room_status]
  );
  return rows[0];
};

exports.deleteRoom = async (id) => {
  const { rowCount } = await db.query(
    `DELETE FROM rooms WHERE room_id = $1`,
    [id]
  );
  return rowCount > 0;
};







