// models/index.js
const { sequelize } = require('../config/db.config'); // Nạp instance sequelize

// Nạp tất cả các models
const Guest = require('./Guest.model');
const Feedback = require('./Feedback.model');
const Booking = require('./Booking.model');
const Rate = require('./Rate.model');
const Room = require('./Room.model');
const RoomType = require('./RoomType.model');

// ----- ĐỊNH NGHĨA CÁC MỐI QUAN HỆ (ASSOCIATIONS) -----

// 1. Guest <-> Booking (Một Guest có nhiều Booking, một Booking thuộc về một Guest)
Guest.hasMany(Booking, {
  foreignKey: 'guest_id', // Khóa ngoại trong bảng 'bookings'
  as: 'bookings'          // Tên bí danh cho mối quan hệ (ví dụ: guest.getBookings())
});
Booking.belongsTo(Guest, {
  foreignKey: 'guest_id',
  as: 'guest'
});

// 2. Guest <-> Feedback
Guest.hasMany(Feedback, {
  foreignKey: 'guest_id',
  as: 'feedbacks'
});
Feedback.belongsTo(Guest, {
  foreignKey: 'guest_id',
  as: 'guest'
});

// 3. RoomType <-> Room
RoomType.hasMany(Room, {
  foreignKey: 'type_id',
  as: 'rooms'
});
Room.belongsTo(RoomType, {
  foreignKey: 'type_id',
  as: 'roomType'
});

// 4. RoomType <-> Rate
RoomType.hasMany(Rate, {
  foreignKey: 'type_id',
  as: 'rates'
});
Rate.belongsTo(RoomType, {
  foreignKey: 'type_id',
  as: 'roomType'
});

// 5. Room <-> Booking
Room.hasMany(Booking, {
  foreignKey: 'room_id',
  as: 'bookings'
});
Booking.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room'
});

// 6. Room <-> Feedback
Room.hasMany(Feedback, {
  foreignKey: 'room_id',
  as: 'feedbacks'
});
Feedback.belongsTo(Room, {
  foreignKey: 'room_id',
  as: 'room'
});

// Đồng bộ hóa tất cả các model với database (chỉ nên dùng trong development nếu bảng chưa có)
// Vì bạn đã có bảng sẵn, bước này có thể không cần thiết hoặc cần cẩn thận.
// Nếu model khớp hoàn toàn với bảng, sequelize.sync() sẽ không làm gì.
// KHÔNG DÙNG { force: true } hoặc { alter: true } nếu bạn không muốn mất/thay đổi dữ liệu hiện có.
/*
sequelize.sync() // Có thể thêm { alter: true } nếu bạn muốn Sequelize cố gắng cập nhật bảng
  .then(() => {
    console.log('🔄 Database & tables synced (hoặc đã tồn tại và khớp model).');
  })
  .catch(error => {
    console.error('❌ Lỗi khi đồng bộ hóa database:', error);
  });
*/

// Xuất khẩu sequelize instance và tất cả các models đã được nạp và liên kết
module.exports = {
  sequelize, // Instance sequelize đã kết nối
  Guest,
  Feedback,
  Booking,
  Rate,
  Room,
  RoomType
};