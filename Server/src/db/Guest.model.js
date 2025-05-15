// models/Guest.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config'); // Nạp instance sequelize

const Guest = sequelize.define('Guest', {
  // Khóa chính: guest_id, SERIAL NOT NULL
  guest_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,    // Đánh dấu là khóa chính
    autoIncrement: true, // Tự động tăng (tương ứng với SERIAL)
    allowNull: false     // NOT NULL
  },
  name: {
    type: DataTypes.STRING(100), // CHARACTER VARYING(100)
    allowNull: true              // NULL (cho phép null)
  },
  passport_number: {
    type: DataTypes.STRING(50),  // CHARACTER VARYING(50)
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),   // CHARACTER VARYING(20)
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(100),  // CHARACTER VARYING(100)
    allowNull: true,
    // Nếu bạn có ràng buộc UNIQUE trên cột email trong DB, bạn nên thêm:
    // unique: true,
    // Bạn cũng có thể thêm validation ở tầng ứng dụng của Sequelize:
    validate: {
      isEmail: true // Kiểm tra định dạng email nếu giá trị được cung cấp
    }
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,         // TEXT
    allowNull: true
  },
  zip_code: {
    type: DataTypes.STRING(20),   // CHARACTER VARYING(20)
    allowNull: true
  }
}, {
  // Các tùy chọn cho Model
  tableName: 'guests', // **QUAN TRỌNG**: Tên bảng phải khớp chính xác với tên bảng trong PostgreSQL
  timestamps: false    // **QUAN TRỌNG**: Đặt là false vì bảng của bạn không có cột createdAt và updatedAt
});

// Xuất khẩu Model
module.exports = Guest;