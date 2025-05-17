// models/Rate.model.js
const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Rate = sequelize.define('Rate', {
  rate_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  deal_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  type_id: {
    type: DataTypes.INTEGER,
    allowNull: true
    // Tham chiếu khóa ngoại đến 'roomtypes' sẽ được định nghĩa khi thiết lập associations
  },
  discount: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  deal_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  availability: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cancellation_policy: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    // Trigger 'trigger_rates_updated_at' trong DB sẽ đảm bảo cột này được cập nhật.
  }
}, {
  tableName: 'rates',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Sau này, bạn sẽ định nghĩa mối quan hệ với Model RoomType (sau khi tạo RoomType.model.js)
// const RoomType = require('./RoomType.model.js'); // Giả sử
// Rate.belongsTo(RoomType, { foreignKey: 'type_id', as: 'roomType' });

module.exports = Rate;