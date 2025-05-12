const db = require('./index');

const SELECT_COLUMNS = `type_id, type_name, base_price, cancellation_policy`;

exports.getRoomTypes = async () => {
  const { rows } = await db.query(
    `SELECT ${SELECT_COLUMNS} FROM roomtypes ORDER BY type_id`
  );
  return rows;
};

exports.getRoomTypeById = async (id) => {
  const { rows } = await db.query(
    `SELECT ${SELECT_COLUMNS} FROM roomtypes WHERE type_id = $1`,
    [id]
  );
  return rows[0];
};

exports.createRoomType = async ({ type_name, base_price, cancellation_policy }) => {
  const { rows } = await db.query(
    `INSERT INTO roomtypes (type_name, base_price, cancellation_policy)
     VALUES ($1, $2, $3) RETURNING ${SELECT_COLUMNS}`,
    [type_name, base_price, cancellation_policy]
  );
  return rows[0];
};

exports.updateRoomType = async (id, { type_name, base_price, cancellation_policy }) => {
  const { rows } = await db.query(
    `UPDATE roomtypes
       SET type_name = $2,
           base_price = $3,
           cancellation_policy = $4
     WHERE type_id = $1
     RETURNING ${SELECT_COLUMNS}`,
    [id, type_name, base_price, cancellation_policy]
  );
  return rows[0];
};

exports.deleteRoomType = async (id) => {
  const { rowCount } = await db.query(
    `DELETE FROM roomtypes WHERE type_id = $1`, [id]
  );
  return rowCount > 0;
};
