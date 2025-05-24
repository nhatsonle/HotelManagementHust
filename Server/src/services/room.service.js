// Chứa business logic chính của ứng dụng cho phòng
const BaseService = require('./base.service');
const { Room, RoomType } = require('../db');
const Joi = require('joi');
const { Op } = require('sequelize');

const ALLOWED_STATUS = ['Available', 'Booked', 'Reserved', 'Cleaning', 'Maintenance'];

// Schema validate đầu vào
const schema = Joi.object({
  room_number: Joi.string().trim().min(1).max(10).required(),
  bed_type: Joi.string().trim().min(2).max(50).required(),
  room_floor: Joi.number().integer().min(1).max(100).required(),
  room_facility: Joi.string().trim().max(500).allow(null, ''),
  room_status: Joi.string().valid(...ALLOWED_STATUS).required(),
  type_id: Joi.number().integer().positive().required(),
  adult_number: Joi.number().integer().min(1).max(10).required(),
  child_number: Joi.number().integer().min(0).max(10).required()
});

// Filter validation schema
const filterSchema = Joi.object({
  // Pagination
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid('room_number', '-room_number', 'room_floor', '-room_floor', 'adult_number', '-adult_number', 'child_number', '-child_number').default('-room_id'),
  
  // Exact matches
  room_number: Joi.string().trim(),
  bed_type: Joi.string().trim(),
  room_status: Joi.string().valid(...ALLOWED_STATUS),
  type_id: Joi.number().integer().positive(),
  
  // Range filters
  floor_min: Joi.number().integer().min(1),
  floor_max: Joi.number().integer().min(1),
  adult_min: Joi.number().integer().min(1),
  adult_max: Joi.number().integer().min(1),
  child_min: Joi.number().integer().min(0),
  child_max: Joi.number().integer().min(0),
  
  // Like searches
  room_number_like: Joi.string().trim(),
  facility_like: Joi.string().trim(),
  
  // Multiple values
  status_in: Joi.string().custom((value, helpers) => {
    const statuses = value.split(',');
    const invalid = statuses.find(s => !ALLOWED_STATUS.includes(s));
    if (invalid) {
      return helpers.error('any.invalid');
    }
    return value;
  }),
  type_id_in: Joi.string().custom((value, helpers) => {
    const ids = value.split(',');
    if (ids.some(id => isNaN(parseInt(id)))) {
      return helpers.error('any.invalid');
    }
    return value;
  })
});

class RoomService extends BaseService {
  constructor() {
    super(Room);
  }

  async getRooms(query = {}) {
    // Validate and sanitize query parameters
    const validatedQuery = await filterSchema.validateAsync(query);

    const {
      page,
      limit,
      sort,
      ...filters
    } = validatedQuery;

    // Build where clause
    const where = {};

    // Handle exact matches
    ['room_number', 'bed_type', 'room_status', 'type_id'].forEach(field => {
      if (filters[field]) {
        where[field] = filters[field];
      }
    });

    // Handle range filters
    if (filters.floor_min || filters.floor_max) {
      where.room_floor = {
        ...(filters.floor_min && { [Op.gte]: filters.floor_min }),
        ...(filters.floor_max && { [Op.lte]: filters.floor_max })
      };
    }

    if (filters.adult_min || filters.adult_max) {
      where.adult_number = {
        ...(filters.adult_min && { [Op.gte]: filters.adult_min }),
        ...(filters.adult_max && { [Op.lte]: filters.adult_max })
      };
    }

    if (filters.child_min || filters.child_max) {
      where.child_number = {
        ...(filters.child_min && { [Op.gte]: filters.child_min }),
        ...(filters.child_max && { [Op.lte]: filters.child_max })
      };
    }

    // Handle like searches
    if (filters.room_number_like) {
      where.room_number = { [Op.iLike]: `%${filters.room_number_like}%` };
    }

    if (filters.facility_like) {
      where.room_facility = { [Op.iLike]: `%${filters.facility_like}%` };
    }

    // Handle multiple values
    if (filters.status_in) {
      where.room_status = { [Op.in]: filters.status_in.split(',') };
    }

    if (filters.type_id_in) {
      where.type_id = { [Op.in]: filters.type_id_in.split(',').map(Number) };
    }

    // Build order clause
    const [field, direction] = sort.startsWith('-') 
      ? [sort.slice(1), 'DESC']
      : [sort, 'ASC'];

    // Calculate offset
    const offset = (page - 1) * limit;

    return await this.findAll({
      where,
      order: [[field, direction]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: RoomType,
        as: 'roomType',
        attributes: ['type_id', 'type_name', 'base_price', 'cancellation_policy']
      }]
    });
  }

  async getRoomById(id) {
    return await this.findById(id, {
      include: [{
        model: RoomType,
        as: 'roomType',
        attributes: ['type_id', 'type_name', 'base_price', 'cancellation_policy']
      }]
    });
  }

  async createRoom(roomData) {
    const validatedData = await schema.validateAsync(roomData);
    return await this.create(validatedData);
  }

  async updateRoom(id, roomData) {
    const validatedData = await schema.validateAsync(roomData);
    return await this.update(id, validatedData);
  }

  async updateRoomStatus(id, status) {
    const validatedStatus = await Joi.string()
      .valid(...ALLOWED_STATUS)
      .required()
      .validateAsync(status);

    return await this.update(id, { room_status: validatedStatus });
  }

  async deleteRoom(id) {
    return await this.delete(id);
  }

  async getAvailableRooms(checkin, checkout, adult, child) {
    // Validate input parameters
    const validationSchema = Joi.object({
      checkin: Joi.date().iso().required(),
      checkout: Joi.date().iso().min(Joi.ref('checkin')).required(),
      adult: Joi.number().integer().min(1).max(10).required(),
      child: Joi.number().integer().min(0).max(10).required()
    });

    await validationSchema.validateAsync({ checkin, checkout, adult, child });

    // Call the database function get_available_rooms
    const results = await this.model.sequelize.query(
      'SELECT * FROM get_available_rooms(:checkin, :checkout, :adult, :child)',
      {
        replacements: {
          checkin,
          checkout,
          adult,
          child
        },
        type: this.model.sequelize.QueryTypes.SELECT
      }
    );

    return results;
  }
}

module.exports = new RoomService();









