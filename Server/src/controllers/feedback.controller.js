const service = require('../services/feedback.service');

exports.getAllFeedbacks = async (req, res) => {
  const data = await service.getAllFeedbacks();
  res.json(data);
};

exports.getRecentFeedbacks = async (req, res) => {
  const data = await service.getRecentFeedbacks();
  res.json(data);
};

exports.createFeedback = async (req, res) => {
  const newFeedback = await service.createFeedback(req.body);
  res.status(201).json(newFeedback);
};

exports.deleteFeedback = async (req, res) => {
  await service.deleteFeedback(req.params.id);
  res.status(204).send();
};
