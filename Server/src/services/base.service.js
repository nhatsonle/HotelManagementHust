const { Op } = require('sequelize');

class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    const {
      where = {},
      include = [],
      order = [['createdAt', 'DESC']],
      limit,
      offset,
      attributes,
      group,
      having,
      distinct
    } = options;

    return await this.model.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      attributes,
      group,
      having,
      distinct
    });
  }

  async findById(id, options = {}) {
    const {
      include = [],
      attributes,
      paranoid = true
    } = options;

    return await this.model.findByPk(id, {
      include,
      attributes,
      paranoid
    });
  }

  async findOne(where, options = {}) {
    const {
      include = [],
      attributes,
      order,
      paranoid = true
    } = options;

    return await this.model.findOne({
      where,
      include,
      attributes,
      order,
      paranoid
    });
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const [updatedCount, updatedRows] = await this.model.update(data, {
      where: { [this.model.primaryKeyAttribute]: id },
      returning: true
    });
    return updatedCount > 0 ? updatedRows[0] : null;
  }

  async delete(id, force = false) {
    const deletedCount = await this.model.destroy({
      where: { [this.model.primaryKeyAttribute]: id },
      force
    });
    return deletedCount > 0;
  }

  async bulkCreate(data, options = {}) {
    return await this.model.bulkCreate(data, options);
  }

  async bulkUpdate(where, data) {
    const [updatedCount, updatedRows] = await this.model.update(data, {
      where,
      returning: true
    });
    return updatedCount > 0 ? updatedRows : [];
  }

  async bulkDelete(where, force = false) {
    const deletedCount = await this.model.destroy({
      where,
      force
    });
    return deletedCount;
  }

  // Helper method to build where clause from query parameters
  buildWhereClause(query) {
    const where = {};
    const { Op } = require('sequelize');

    for (const [key, value] of Object.entries(query)) {
      if (key.endsWith('_like')) {
        const field = key.replace('_like', '');
        where[field] = { [Op.iLike]: `%${value}%` };
      } else if (key.endsWith('_gt')) {
        const field = key.replace('_gt', '');
        where[field] = { [Op.gt]: value };
      } else if (key.endsWith('_lt')) {
        const field = key.replace('_lt', '');
        where[field] = { [Op.lt]: value };
      } else if (key.endsWith('_gte')) {
        const field = key.replace('_gte', '');
        where[field] = { [Op.gte]: value };
      } else if (key.endsWith('_lte')) {
        const field = key.replace('_lte', '');
        where[field] = { [Op.lte]: value };
      } else if (key.endsWith('_in')) {
        const field = key.replace('_in', '');
        where[field] = { [Op.in]: value.split(',') };
      } else if (key.endsWith('_not_in')) {
        const field = key.replace('_not_in', '');
        where[field] = { [Op.notIn]: value.split(',') };
      } else {
        where[key] = value;
      }
    }

    return where;
  }
}

module.exports = BaseService; 