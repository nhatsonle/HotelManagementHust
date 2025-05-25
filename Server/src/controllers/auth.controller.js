const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Guest } = require('../db');
const { sequelize } = require('../db');
const { Op } = require('sequelize');
const createError = require('http-errors');
const Joi = require('joi');
const crypto = require('crypto');

// Validation schema for sign up
const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().max(100).allow(null, ''),
  phone: Joi.string().max(20).allow(null, ''),
  address: Joi.string().allow(null, ''),
  city: Joi.string().max(100).allow(null, ''),
  region: Joi.string().max(100).allow(null, ''),
  zip_code: Joi.string().max(20).allow(null, '')
});

// Validation schema for sign in
const signInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Validation schema for change password
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
});

// Validation schema for reset password request
const resetPasswordRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

// Validation schema for reset password confirmation
const resetPasswordConfirmSchema = Joi.object({
  token: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
    .messages({
      'string.min': 'New password must be at least 6 characters long',
      'any.required': 'New password is required'
    })
});

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      user_id: user.user_id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Sign up controller
const signUp = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Validate request body
    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const {
      username,
      email,
      password,
      full_name,
      phone,
      address,
      city,
      region,
      zip_code
    } = value;

    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Username already exists',
            status: 400
          }
        });
      }
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Email already exists',
            status: 400
          }
        });
      }
    }

    // Create user - password will be hashed by the model's beforeCreate hook
    const user = await User.create({
      username,
      email,
      password_hash: password, // Pass the plain password, let the model hash it
      full_name,
      is_active: true
    }, { transaction });

    // Create guest profile
    const guest = await Guest.create({
      name: full_name,
      phone,
      email,
      address,
      city,
      region,
      zip_code,
      user_id: user.user_id
    }, { transaction });

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Commit transaction
    await transaction.commit();

    // Return success response
    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at
        },
        guest: {
          guest_id: guest.guest_id,
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
          address: guest.address,
          city: guest.city,
          region: guest.region,
          zip_code: guest.zip_code
        }
      }
    });

  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();

    console.error('Sign up error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Sign in controller
const signIn = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      console.log('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { username, password } = value;
    console.log('Attempting sign in for username:', username);

    // Find user by username
    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      console.log('User not found with username:', username);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid username or password',
          status: 401
        }
      });
    }

    console.log('User found:', {
      user_id: user.user_id,
      username: user.username,
      is_active: user.is_active
    });

    // Check if account is active
    if (!user.is_active) {
      console.log('Account is inactive for user:', username);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Account is inactive',
          status: 401
        }
      });
    }

    // Verify password using the model's comparePassword method
    console.log('Attempting password verification...');
    const isValidPassword = await user.comparePassword(password);
    console.log('Password verification result:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid username or password',
          status: 401
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Sign in successful for user:', username);

    // Return success response
    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          is_active: user.is_active,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Reset password function
const resetPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Find user
    const user = await User.findOne({
      where: { username }
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

    // Update password - will be hashed by the model's beforeUpdate hook
    user.password_hash = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Sign out controller
const signOut = async (req, res) => {
  try {
    // In a real application, you might want to:
    // 1. Add the token to a blacklist
    // 2. Clear any server-side sessions
    // 3. Clear any client-side cookies
    
    return res.status(200).json({
      success: true,
      message: 'Successfully signed out'
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Change password controller
const changePassword = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { currentPassword, newPassword } = value;
    const userId = req.user.user_id; // Get user ID from the authenticated request

    // Find user
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

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Current password is incorrect',
          status: 400
        }
      });
    }

    // Update password using the model's password handling
    user.password_hash = newPassword; // The model's beforeUpdate hook will hash this
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Request password reset
const requestPasswordReset = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = resetPasswordRequestSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { email } = value;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Store reset token in user record
    await user.update({
      reset_token: resetToken,
      reset_token_expiry: resetTokenExpiry
    });

    // TODO: Send email with reset link
    // In a real application, you would send an email with a link like:
    // `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    console.log('Reset token:', resetToken); // For development only

    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions'
    });

  } catch (error) {
    console.error('Request password reset error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Something went wrong!',
        status: 500
      }
    });
  }
};

// Confirm password reset
const confirmPasswordReset = async (req, res) => {
  try {
    // Validate request body
    const { error, value } = resetPasswordConfirmSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: error.details[0].message,
          status: 400
        }
      });
    }

    const { token, newPassword } = value;

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        reset_token: token,
        reset_token_expiry: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid or expired reset token',
          status: 400
        }
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    await user.update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expiry: null
    });

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });

  } catch (error) {
    console.error('Confirm password reset error:', error);
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
  signUp,
  signIn,
  signOut,
  resetPassword,
  requestPasswordReset,
  confirmPasswordReset,
  changePassword
};
