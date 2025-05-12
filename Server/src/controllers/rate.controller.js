// Xử lý logic request/response cho giá/khuyến mãi
const rateService = require('../services/rate.service');

exports.getRates = async (req, res, next) => {
  try {
    const list = await rateService.getRates();
    res.status(200).json(list);
  } catch (err) { next(err); }
};

exports.getRateById = async (req, res, next) => {
  try {
    const rate = await rateService.getRateById(req.params.id);
    if (!rate) return res.status(404).json({ message: 'Rate not found' });
    res.status(200).json(rate);
  } catch (err) { next(err); }
};

exports.createRate = async (req, res, next) => {
  try {
    const created = await rateService.createRate(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.updateRate = async (req, res, next) => {
  try {
    const updated = await rateService.updateRate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Rate not found' });
    res.status(200).json(updated);
  } catch (err) { next(err); }
};

exports.deleteRate = async (req, res, next) => {
  try {
    const ok = await rateService.deleteRate(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Rate not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};
