// Nơi load và validate biến môi trường (nếu cần)
require('dotenv').config();

const envConfig = {
  // Database configuration
  db: {
    host: process.env.DB_HOST || 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres.owmhoegdsaeilrpkardv',
    password: process.env.DB_PASSWORD || 'hmshms',
    port: process.env.DB_PORT || 5432,
  },
  // Add other environment configurations here
};

module.exports = envConfig;