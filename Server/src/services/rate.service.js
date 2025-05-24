const { Op } = require('sequelize');
const Joi = require('joi');
const Rate = require('../db/Rate.model');

// Validation schema for rate creation/update
const rateSchema = Joi.object({
  deal_name: Joi.string().min(2).max(100).required(),
  type_id: Joi.number().integer().min(1).required(),
  discount: Joi.number().precision(2).min(0).max(100).required(),
  deal_price: Joi.number().precision(2).min(0).required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
  availability: Joi.number().integer().min(0).required(),
  cancellation_policy: Joi.string().max(50).required()
});

// Schema for rate updates - all fields optional
const updateRateSchema = Joi.object({
  deal_name: Joi.string().min(2).max(100),
  type_id: Joi.number().integer().min(1),
  discount: Joi.number().precision(2).min(0).max(100),
  deal_price: Joi.number().precision(2).min(0),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')),
  availability: Joi.number().integer().min(0),
  cancellation_policy: Joi.string().max(50)
});

// Validation schema for query parameters
const filterSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().valid(
    'deal_name', '-deal_name',
    'deal_price', '-deal_price',
    'discount', '-discount',
    'start_date', '-start_date',
    'end_date', '-end_date',
    'availability', '-availability'
  ).default('-rate_id'),
  deal_name: Joi.string(),
  deal_name_like: Joi.string(),
  type_id: Joi.number().integer().min(1),
  min_discount: Joi.number().min(0).max(100),
  max_discount: Joi.number().min(0).max(100),
  min_price: Joi.number().min(0),
  max_price: Joi.number().min(0),
  start_date_after: Joi.date().iso(),
  start_date_before: Joi.date().iso(),
  end_date_after: Joi.date().iso(),
  end_date_before: Joi.date().iso(),
  min_availability: Joi.number().integer().min(0),
  max_availability: Joi.number().integer().min(0),
  cancellation_policy: Joi.string(),
  active: Joi.boolean()
});

class RateService {
  async getRates(query = {}) {
    try {
      // Validate query parameters
      const { error, value } = filterSchema.validate(query);
      if (error) {
        throw error;
      }

      const { page, limit, sort, active, ...filters } = value;
      const offset = (page - 1) * limit;

      // Build where clause
      const where = {};
      
      // Handle active filter
      if (active !== undefined) {
        const now = new Date().toISOString().split('T')[0];
        if (active) {
          where[Op.and] = [
            { start_date: { [Op.lte]: now } },
            { end_date: { [Op.gte]: now } }
          ];
        } else {
          where[Op.or] = [
            { start_date: { [Op.gt]: now } },
            { end_date: { [Op.lt]: now } }
          ];
        }
      }

      // Handle other filters
      if (filters.deal_name) {
        where.deal_name = filters.deal_name;
      }
      if (filters.deal_name_like) {
        where.deal_name = {
          [Op.iLike]: `%${filters.deal_name_like}%`
        };
      }
      if (filters.type_id) {
        where.type_id = filters.type_id;
      }
      if (filters.cancellation_policy) {
        where.cancellation_policy = filters.cancellation_policy;
      }

      // Handle numeric ranges
      if (filters.min_discount || filters.max_discount) {
        where.discount = {};
        if (filters.min_discount) {
          where.discount[Op.gte] = filters.min_discount;
        }
        if (filters.max_discount) {
          where.discount[Op.lte] = filters.max_discount;
        }
      }

      if (filters.min_price || filters.max_price) {
        where.deal_price = {};
        if (filters.min_price) {
          where.deal_price[Op.gte] = filters.min_price;
        }
        if (filters.max_price) {
          where.deal_price[Op.lte] = filters.max_price;
        }
      }

      if (filters.min_availability || filters.max_availability) {
        where.availability = {};
        if (filters.min_availability) {
          where.availability[Op.gte] = filters.min_availability;
        }
        if (filters.max_availability) {
          where.availability[Op.lte] = filters.max_availability;
        }
      }

      // Handle date ranges
      if (filters.start_date_after || filters.start_date_before) {
        where.start_date = {};
        if (filters.start_date_after) {
          where.start_date[Op.gte] = filters.start_date_after;
        }
        if (filters.start_date_before) {
          where.start_date[Op.lte] = filters.start_date_before;
        }
      }

      if (filters.end_date_after || filters.end_date_before) {
        where.end_date = {};
        if (filters.end_date_after) {
          where.end_date[Op.gte] = filters.end_date_after;
        }
        if (filters.end_date_before) {
          where.end_date[Op.lte] = filters.end_date_before;
        }
      }

      // Determine sort order
      const [sortField, sortOrder] = sort.startsWith('-') 
        ? [sort.substring(1), 'DESC']
        : [sort, 'ASC'];

      // Get total count for pagination
      const total = await Rate.count({ where });

      // Get rates with pagination and sorting
      const rates = await Rate.findAll({
        where,
        order: [[sortField, sortOrder]],
        limit,
        offset
      });

      return {
        data: rates,
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

  async getRateById(id) {
    try {
      const rate = await Rate.findByPk(id);
      if (!rate) {
        throw new Error('Rate not found');
      }
      return rate;
    } catch (error) {
      throw error;
    }
  }

  async createRate(rateData) {
    try {
      // Validate rate data
      const { error, value } = rateSchema.validate(rateData);
      if (error) {
        throw error;
      }

      const rate = await Rate.create(value);
      return rate;
    } catch (error) {
      throw error;
    }
  }

  async updateRate(id, rateData) {
    try {
      // Validate rate data using update schema
      const { error, value } = updateRateSchema.validate(rateData);
      if (error) {
        throw error;
      }

      const rate = await Rate.findByPk(id);
      if (!rate) {
        throw new Error('Rate not found');
      }

      await rate.update(value);
      return rate;
    } catch (error) {
      throw error;
    }
  }

  async deleteRate(id) {
    try {
      const rate = await Rate.findByPk(id);
      if (!rate) {
        throw new Error('Rate not found');
      }

      await rate.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RateService();
