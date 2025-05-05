// Export connection pool hoặc khởi tạo kết nối DB
const { Pool } = require('pg');

const pool = new Pool({
  user: 'your_user',
  host: 'localhost',
  database: 'your_database',
  password: 'your_password',
  port: 5432,
});

module.exports = pool;