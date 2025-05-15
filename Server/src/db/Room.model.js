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
    // QUAN TRỌNG: Thay thế các giá trị 'available', 'occupied', 'maintenance'
    // bằng các giá trị thực tế có trong kiểu ENUM 'public.room_status_enum' của bạn.
    // Ví dụ: type: DataTypes.ENUM('Trống', 'Có khách', 'Đang sửa chữa', 'Đang dọn dẹp'),
    type: DataTypes.ENUM('Available', 'Booked', 'Maintenance', 'Reserved'), // <-- THAY THẾ CÁC GIÁ TRỊ ENUM NÀY!
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

// Sau này, bạn sẽ định nghĩa mối quan hệ với Model RoomType
// const RoomType = require('./RoomType.model.js'); // Giả sử
// Room.belongsTo(RoomType, { foreignKey: 'type_id', as: 'roomType' });
// RoomType.hasMany(Room, { foreignKey: 'type_id', as: 'rooms' });


module.exports = Room;