require('dotenv').config();
const { db } = require('./env.config');
const { Pool } = require('pg');

const pool = new Pool(db);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Lỗi kết nối đến database:', err.stack);
  } else {
    console.log('Kết nối database thành công tại:', res.rows[0].now);
  }
});


module.exports = {
  query: (text, params) => pool.query(text, params),
};