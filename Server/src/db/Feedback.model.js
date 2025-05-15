// models/Feedback.model.js
const { DataTypes, Sequelize } = require('sequelize'); // Sequelize object is also available for sequelize.literal
const { sequelize } = require('../config/db.config'); // Nạp instance sequelize của bạn

// Để định nghĩa mối quan hệ (associations) sau này, bạn sẽ cần nạp các model liên quan:
// const Guest = require('./Guest.model');
// const Room = require('./Room.model'); // Giả sử bạn sẽ có model Room

const Feedback = sequelize.define('Feedback', {
  feedback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  guest_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu đến bảng 'guests' sẽ được định nghĩa khi thiết lập associations
    // references: {
    //   model: 'guests', // Tên bảng hoặc Model Guest
    //   key: 'guest_id'
    // }
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu đến bảng 'rooms' sẽ được định nghĩa khi thiết lập associations
    // references: {
    //   model: 'rooms', // Tên bảng hoặc Model Room
    //   key: 'room_id'
    // }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Cột 'created_at' trong database của bạn
  // Sequelize có thể quản lý trường này nếu bạn đặt tên thuộc tính là 'createdAt' (camelCase)
  // và cấu hình `createdAt: 'created_at'` trong options của model.
  created_at: { // Đặt tên thuộc tính trong model khớp với tên cột trong DB cho rõ ràng
    type: DataTypes.DATE, // DataTypes.DATE trong Sequelize thường map với TIMESTAMP trong PostgreSQL
    allowNull: true,      // Khớp với DDL của bạn
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Để Sequelize biết DB có default này
                                                        // hoặc DataTypes.NOW nếu muốn Sequelize tạo timestamp khi tạo record
  }
}, {
  tableName: 'feedback', // Tên bảng chính xác trong PostgreSQL
  timestamps: true,      // Báo cho Sequelize rằng có các cột timestamp cần quản lý
  updatedAt: false,      // **QUAN TRỌNG**: Bảng của bạn không có cột 'updatedAt', nên đặt là false
  createdAt: 'created_at'  // **QUAN TRỌNG**: Ánh xạ thuộc tính `createdAt` (mà Sequelize quản lý nếu timestamps:true)
                         // tới cột `created_at` trong database của bạn.
});

// Sau khi bạn đã định nghĩa các Model Guest và Room, bạn sẽ thiết lập mối quan hệ ở đây:
// Ví dụ:
// const Guest = require('./Guest.model'); // Giả sử Guest model đã được định nghĩa
// Feedback.belongsTo(Guest, { foreignKey: 'guest_id', as: 'guest' });
// Guest.hasMany(Feedback, { foreignKey: 'guest_id', as: 'feedbacks' });

// Tương tự cho Room nếu bạn có Room model:
// const Room = require('./Room.model');
// Feedback.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
// Room.hasMany(Feedback, { foreignKey: 'room_id', as: 'feedbacks' });

module.exports = Feedback;