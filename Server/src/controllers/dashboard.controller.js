const dashboardService = require('../services/dashboard.service');

exports.getTodaySummary = async (req, res) => {
  const data = await dashboardService.getTodaySummary();
  res.json(data);
};

exports.getRoomTypes = async (req, res) => {
  const data = await dashboardService.getRoomTypes();
  res.json(data);
};

exports.getRoomStatus = async (req, res) => {
  const data = await dashboardService.getRoomStatus();
  res.json(data);
};

exports.getMonthlyOccupancy = async (req, res) => {
  const data = await dashboardService.getMonthlyOccupancy();
  res.json(data);
};
