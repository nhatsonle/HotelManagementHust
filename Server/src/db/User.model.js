const { DataTypes, Sequelize } = require('sequelize');
const { sequelize } = require('../config/db.config');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 50] // Username length between 3 and 50 characters
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
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
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        console.log('Hashing password in beforeCreate hook:');
        console.log('Original password:', user.password_hash);
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
        console.log('Hashed password:', user.password_hash);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password_hash')) {
        console.log('Hashing password in beforeUpdate hook:');
        console.log('Original password:', user.password_hash);
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
        console.log('Hashed password:', user.password_hash);
      }
    }
  }
});

// Instance method to check password
User.prototype.comparePassword = async function(candidatePassword) {
  console.log('Comparing passwords:');
  console.log('Candidate password:', candidatePassword);
  console.log('Stored hash:', this.password_hash);
  const result = await bcrypt.compare(candidatePassword, this.password_hash);
  console.log('Comparison result:', result);
  return result;
};

module.exports = User; 