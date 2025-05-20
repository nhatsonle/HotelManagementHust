// const {Client}  = require('pg');
const {Sequelize} = require('sequelize');


const DATABASE_NAME = 'postgres'; // Tên database bạn đã tạo trong PostgreSQL
const DB_USER = 'postgres.owmhoegdsaeilrpkardv';             // Username để kết nối PostgreSQL (thường là 'postgres' nếu cài đặt mặc định)
const DB_PASSWORD = 'hmshms'; // Mật khẩu của user PostgreSQL bạn dùng
const DB_HOST = 'aws-0-ap-southeast-1.pooler.supabase.com';            // Host nơi PostgreSQL đang chạy (thường là 'localhost')
const DB_PORT = 5432;        



// const client = new Client({
//     user: 'postgres.owmhoegdsaeilrpkardv',
//     host: 'aws-0-ap-southeast-1.pooler.supabase.com',  
//     database: 'postgres',
//     password: 'hmshms',
//     port: 5432, 
// });

// Khởi tạo một instance của Sequelize
const sequelize = new Sequelize(DATABASE_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres', // Quan trọng: Chỉ định rõ chúng ta đang dùng PostgreSQL
    logging: (msg) => console.log(`[Sequelize] ${msg}`), // Hiển thị các câu lệnh SQL mà Sequelize thực thi
    // logging: false, // Bỏ comment dòng này để tắt log SQL nếu bạn không muốn thấy
  });


  // Hàm để kiểm tra kết nối đến database
const connectDB = async () => {
    try {
      await sequelize.authenticate(); // Thử xác thực kết nối
      console.log('✅ Đã kết nối thành công đến PostgreSQL!');
    } catch (error) {
      console.error('❌ Không thể kết nối đến cơ sở dữ liệu PostgreSQL:', error);
      // Nếu không kết nối được database thì ứng dụng không nên chạy tiếp
      process.exit(1);
    }
  };
  
  // Xuất khẩu instance sequelize và hàm connectDB để các file khác có thể sử dụng
  module.exports = { sequelize, connectDB };