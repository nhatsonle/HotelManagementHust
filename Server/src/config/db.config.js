const { Sequelize } = require('sequelize');
const { db } = require('./env.config');

const sequelize = new Sequelize(db.database, db.user, db.password, {
  host: db.host,
  port: db.port,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false, // Set to console.log to see SQL queries
  define: {
    timestamps: false, // Disable timestamps by default
    underscored: true, // Use snake_case for fields
    freezeTableName: true // Don't pluralize table names
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // You might want to set this to true in production
    }
  },
  retry: {
    max: 3 // Maximum retry attempts for connection
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
    process.exit(1); // Exit if we can't connect to the database
  });

module.exports = { sequelize, Sequelize }; 