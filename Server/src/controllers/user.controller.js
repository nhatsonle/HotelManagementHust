const { User, Guest } = require('../db');
const { Op } = require('sequelize');
const createError = require('http-errors');
const Joi = require('joi');
const { sequelize } = require('../db');

// Validation schema for user update
const userUpdateSchema = Joi.object({
  email: Joi.string().email().max(100),
  full_name: Joi.string().max(100),
  is_active: Joi.boolean(),
  guest: Joi.object({
    phone: Joi.string().max(20),
    address: Joi.string(),
    city: Joi.string().max(100),
    region: Joi.string().max(100),
    zip_code: Joi.string().max(20)
  })
});

// Get all users with pagination and search
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { username: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password_hash'] }
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
        total: count,
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Guest,
        as: 'Guest'
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  let transaction;

  try {
    transaction = await sequelize.transaction();
    const { userId } = req.params;

    // Validate request body
    const { error, value } = userUpdateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    // Extract guest data from request
    const { guest, ...userData } = value;

    // Update user
    await user.update(userData, { transaction });

    // Update guest information if provided
    if (guest) {
      const guestRecord = await Guest.findOne({
        where: { user_id: userId }
      });

      if (guestRecord) {
        await guestRecord.update(guest, { transaction });
      } else {
        // Create new guest record if it doesn't exist
        await Guest.create({
          ...guest,
          user_id: userId,
          name: userData.full_name || user.full_name
        }, { transaction });
      }
    }

    // Get updated user and guest information
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
      include: [{
        model: Guest,
        as: 'Guest'
      }]
    });

    // Commit transaction
    await transaction.commit();

    return res.status(200).json({
      success: true,
      data: { user: updatedUser }
    });
  } catch (error) {
    // Rollback transaction on error if it exists and hasn't been committed
    if (transaction) {
      await transaction.rollback();
    }

    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          status: 404
        }
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}; 