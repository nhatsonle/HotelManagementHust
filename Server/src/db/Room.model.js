// models/Room.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true // Khớp với ràng buộc UNIQUE trong database
  },
  bed_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  room_floor: {
    type: DataTypes.SMALLINT, // Dùng cho kiểu SMALLINT
    allowNull: true
  },
  room_facility: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  room_status: {
    
    type: DataTypes.ENUM('Available', 'Booked', 'Maintenance', 'Reserved','Cleaning'), 
    allowNull: true
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu khóa ngoại đến 'roomtypes' sẽ được định nghĩa khi thiết lập associations
  },
  adult_number: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  child_number: {
    type: DataTypes.SMALLINT,
    allowNull: true
  }
}, {
  tableName: 'rooms',     // Tên bảng chính xác trong PostgreSQL
  timestamps: false       // **RẤT QUAN TRỌNG**: Bảng của bạn không có cột createdAt và updatedAt
});




module.exports = Room;