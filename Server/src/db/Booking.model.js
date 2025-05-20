// models/Booking.model.js
const { DataTypes, Sequelize } = require('sequelize'); // Nạp Sequelize để dùng Sequelize.literal nếu cần
const { sequelize } = require('../config/db.config');   // Nạp instance sequelize của bạn

const Booking = sequelize.define('Booking', {
  booking_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu khóa ngoại sẽ được định nghĩa khi thiết lập associations
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu khóa ngoại sẽ được định nghĩa khi thiết lập associations
  },
  check_in: {
    type: DataTypes.DATEONLY, // Dùng cho kiểu DATE trong SQL (chỉ ngày, không có giờ)
    allowNull: true
  },
  check_out: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2), // Dùng cho kiểu NUMERIC(precision, scale)
    allowNull: true
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  status: {
    // QUAN TRỌNG: Thay thế các giá trị 'pending', 'confirmed', 'cancelled'
    // bằng các giá trị thực tế có trong kiểu ENUM 'public.booking_status_enum' của bạn.
    // Ví dụ: type: DataTypes.ENUM('Chờ xác nhận', 'Đã xác nhận', 'Đã hủy', 'Hoàn thành'),
    type: DataTypes.ENUM('Booked', 'Cancelled', 'Awaiting-Payment'), // <-- THAY THẾ CÁC GIÁ TRỊ ENUM NÀY!
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE, // DataTypes.DATE trong Sequelize map với TIMESTAMP trong PostgreSQL
    allowNull: true,      // DDL của bạn cho phép NULL nhưng có DEFAULT
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Để Sequelize biết về giá trị default của DB
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,      // DDL của bạn cho phép NULL nhưng có DEFAULT và trigger
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    // Trigger 'trigger_bookings_updated_at' trong DB sẽ đảm bảo cột này được cập nhật.
    // Sequelize cũng sẽ cố gắng cập nhật nó khi `timestamps: true`.
  },
  num_adults: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  num_children: {
    type: DataTypes.SMALLINT,
    allowNull: true
  },
  
}, {
  tableName: 'bookings', // Tên bảng chính xác trong PostgreSQL
  timestamps: true,      // Bảng của bạn có cả created_at và updated_at
  createdAt: 'created_at', // Ánh xạ thuộc tính `createdAt` của model tới cột `created_at`
  updatedAt: 'updated_at'  // Ánh xạ thuộc tính `updatedAt` của model tới cột `updated_at`
});

// Sau này, bạn sẽ định nghĩa các mối quan hệ (associations) ở đây, ví dụ:
// const Guest = require('./Guest.model');
// const Room = require('./Room.model'); // Giả sử bạn sẽ có Room model
// Booking.belongsTo(Guest, { foreignKey: 'guest_id', as: 'guest' });
// Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

module.exports = Booking;