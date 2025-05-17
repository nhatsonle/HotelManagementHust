const { Op } = require('sequelize');
const Joi = require('joi');
const RoomType = require('../db/RoomType.model');

// Validation schema for room type creation/update
const roomTypeSchema = Joi.object({
  type_name: Joi.string().min(2).max(50).required(),
  base_price: Joi.number().precision(2).min(0).required(),
  cancellation_policy: Joi.string().max(50).required()
});

// Validation schema for query parameters
const filterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('type_name', '-type_name', 'base_price', '-base_price').default('-type_id'),
  type_name: Joi.string(),
  type_name_like: Joi.string(),
  min_price: Joi.number().min(0),
  max_price: Joi.number().min(0),
  cancellation_policy: Joi.string()
});

class RoomTypeService {
  async getRoomTypes(query = {}) {
    try {
      // Validate query parameters
      const { error, value } = filterSchema.validate(query);
      if (error) {
        throw error;
      }

      const { page, limit, sort, ...filters } = value;
      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};
      if (filters.type_name) {
        where.type_name = filters.type_name;
      }
      if (filters.type_name_like) {
        where.type_name = {
          [Op.iLike]: `%${filters.type_name_like}%`
        };
      }
      if (filters.cancellation_policy) {
        where.cancellation_policy = filters.cancellation_policy;
      }
      if (filters.min_price || filters.max_price) {
        where.base_price = {};
        if (filters.min_price) {
          where.base_price[Op.gte] = filters.min_price;
        }
        if (filters.max_price) {
          where.base_price[Op.lte] = filters.max_price;
        }
      }

      // Determine sort order
      const [sortField, sortOrder] = sort.startsWith('-') 
        ? [sort.substring(1), 'DESC']
        : [sort, 'ASC'];

      // Get total count for pagination
      const total = await RoomType.count({ where });

      // Get room types with pagination and sorting
      const roomTypes = await RoomType.findAll({
        where,
        order: [[sortField, sortOrder]],
        limit,
        offset
      });

      return {
        data: roomTypes,
        meta: {
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          },
          filters,
          sort
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoomTypeById(id) {
    try {
      const roomType = await RoomType.findByPk(id);
      if (!roomType) {
        throw new Error('Room type not found');
      }
      return roomType;
    } catch (error) {
      throw error;
    }
  }

  async createRoomType(roomTypeData) {
    try {
      // Validate room type data
      const { error, value } = roomTypeSchema.validate(roomTypeData);
      if (error) {
        throw error;
      }

      const roomType = await RoomType.create(value);
      return roomType;
    } catch (error) {
      throw error;
    }
  }

  async updateRoomType(id, roomTypeData) {
    try {
      // Validate room type data
      const { error, value } = roomTypeSchema.validate(roomTypeData);
      if (error) {
        throw error;
      }

      const roomType = await RoomType.findByPk(id);
      if (!roomType) {
        throw new Error('Room type not found');
      }

      await roomType.update(value);
      return roomType;
    } catch (error) {
      throw error;
    }
  }

  async deleteRoomType(id) {
    try {
      const roomType = await RoomType.findByPk(id);
      if (!roomType) {
        throw new Error('Room type not found');
      }

      await roomType.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RoomTypeService();
