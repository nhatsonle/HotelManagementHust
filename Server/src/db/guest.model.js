const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config'); // ✅ Lấy trực tiếp instance

const Guest = sequelize.define('Guest', {
  guest_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
}, {
  tableName: 'guests',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Guest;
