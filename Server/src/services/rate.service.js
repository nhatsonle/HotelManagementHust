// Chứa business logic cho giá/khuyến mãi
const Joi        = require('joi');
const rateQuery  = require('../db/rate.queries');

// Schema validate đầu vào
const schema = Joi.object({
  type_id:            Joi.number().integer().positive().required(),
  deal_name:          Joi.string().trim().min(2).max(120).required(),
  deal_price:         Joi.number().min(0).required(),
  cancellation_policy:Joi.string().trim().max(255).allow(null, ''),
  availability:       Joi.number().integer().min(0).required(),
  start_date:         Joi.date().iso().required(),
  end_date:           Joi.date().iso().min(Joi.ref('start_date')).required(),
  discount:           Joi.number().precision(2).min(0).max(100).required()
});

exports.getRates     = () => rateQuery.getRates();
exports.getRateById  = (id) => rateQuery.getRateById(id);

exports.createRate = async (data) => {
  const v = await schema.validateAsync(data);
  return rateQuery.createRate(v);
};

exports.updateRate = async (id, data) => {
  const v = await schema.validateAsync(data);
  return rateQuery.updateRate(id, v);
};

exports.deleteRate   = (id) => rateQuery.deleteRate(id);
