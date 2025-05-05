// Hàm thực thi SQL cho Guests (CRUD khách hàng)

const db = require('./db');

// Thêm khách hàng mới
async function addGuest(name, email) {
    const query = 'INSERT INTO guests (name, email) VALUES ($1, $2)';
    const values = [name, email];
    await db.query(query, values);
}

// Lấy danh sách khách hàng
async function getGuests() {
    const query = 'SELECT * FROM guests';
    const result = await db.query(query);
    return result.rows;
}

// Cập nhật thông tin khách hàng
async function updateGuest(id, name, email) {
    const query = 'UPDATE guests SET name = $1, email = $2 WHERE id = $3';
    const values = [name, email, id];
    await db.query(query, values);
}

// Xóa khách hàng
async function deleteGuest(id) {
    const query = 'DELETE FROM guests WHERE id = $1';
    const values = [id];
    await db.query(query, values);
}

module.exports = {
    addGuest,
    getGuests,
    updateGuest,
    deleteGuest,
};