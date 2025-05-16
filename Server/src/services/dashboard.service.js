// Chứa business logic cho báo cáo/thống kê
const q = require('../db/dashboard.queries');

exports.getTodaySummary = async () => {
  const [checkIn, checkOut, inHotel] = await Promise.all([
    q.getTodayCheckin(),
    q.getTodayCheckout(),
    q.getCurrentGuests()
  ]);
  return { checkIn, checkOut, inHotel };
};

exports.getRoomTypes = () => q.getRoomTypes();

exports.getRoomStatus = () => q.getRoomStatus();

exports.getMonthlyOccupancy = () => q.getMonthlyOccupancy();
