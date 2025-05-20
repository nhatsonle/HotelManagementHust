// models/RoomType.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const RoomType = sequelize.define('RoomType', {
  type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  type_name: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2), // Dùng cho kiểu NUMERIC(precision, scale)
    allowNull: true
  },
  cancellation_policy: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'roomtypes', // Tên bảng chính xác trong PostgreSQL
  timestamps: false       // **RẤT QUAN TRỌNG**: Bảng của bạn không có cột createdAt và updatedAt
});

// Sau khi bạn đã định nghĩa các Model Room và Rate,
// bạn sẽ thiết lập mối quan hệ ở file khởi tạo model hoặc file associations riêng, ví dụ:
// const Room = require('./Room.model');
// const Rate = require('./Rate.model');
// RoomType.hasMany(Room, { foreignKey: 'type_id', as: 'rooms' });
// RoomType.hasMany(Rate, { foreignKey: 'type_id', as: 'rates' });

module.exports = RoomType;