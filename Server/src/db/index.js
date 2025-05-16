// Export connection pool hoặc khởi tạo kết nối DB
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.owmhoegdsaeilrpkardv',
  host: 'aws-0-ap-southeast-1.pooler.supabase.com',
  database: 'postgres',
  password: 'hmshms',
  port: 5432,
});

module.exports = pool;