const pool = require('./index');

// Lấy tất cả khách
exports.getAllGuests = async () => {
  const result = await pool.query('SELECT * FROM guests ORDER BY guest_id DESC');
  return result.rows;
};

// Lấy khách theo guest_id
exports.getGuestById = async (guest_id) => {
  const result = await pool.query('SELECT * FROM guests WHERE guest_id = $1', [guest_id]);
  return result.rows[0];
};

// Thêm khách mới
exports.createGuest = async (name, phone, email, passport_number, city, region, address, zip_code) => {
  const result = await pool.query(
    'INSERT INTO guests (name, phone, email, passport_number, city, region, address, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [name, phone, email, passport_number, city, region, address, zip_code]
  );
  return result.rows[0];
};

// Cập nhật theo guest_id
exports.updateGuest = async (guest_id, name, phone, email, passport_number, city, region, address, zip_code) => {
  const result = await pool.query(
    'UPDATE guests SET name = $1, phone = $2, email = $3, passport_number = $4, city = $5, region = $6, address = $7, zip_code = $8 WHERE guest_id = $9 RETURNING *',
    [name, phone, email, passport_number, city, region, address, zip_code, guest_id]
  );
  return result.rows[0];
};

// Xoá theo guest_id
exports.deleteGuest = async (guest_id) => {
  await pool.query('DELETE FROM guests WHERE guest_id = $1', [guest_id]);
};