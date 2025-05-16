const db = require('./index');

// Số check-in / check-out hôm nay
exports.getTodayCheckin = async () => {
  const result = await db.query('SELECT COUNT(*) FROM bookings WHERE check_in = CURRENT_DATE');
  return parseInt(result.rows[0].count);
};

exports.getTodayCheckout = async () => {
  const result = await db.query('SELECT COUNT(*) FROM bookings WHERE check_out = CURRENT_DATE');
  return parseInt(result.rows[0].count);
};

// Số khách hiện đang ở trong khách sạn
exports.getCurrentGuests = async () => {
  const result = await db.query(`
    SELECT COUNT(*) FROM bookings 
    WHERE CURRENT_DATE BETWEEN check_in AND check_out
  `);
  return parseInt(result.rows[0].count);
};

// Thống kê loại phòng
exports.getRoomTypes = async () => {
  const result = await db.query(`
    SELECT room_type, COUNT(*) FILTER (WHERE status = 'occupied') AS occupied, COUNT(*) AS total, MAX(price_per_day) AS price
    FROM rooms
    GROUP BY room_type
  `);
  return result.rows;
};

// Phân loại phòng theo trạng thái
exports.getRoomStatus = async () => {
  const result = await db.query(`
    SELECT 
      COUNT(*) FILTER (WHERE status = 'occupied') AS occupied,
      COUNT(*) FILTER (WHERE status = 'available') AS available,
      COUNT(*) FILTER (WHERE clean_status = 'clean') AS clean,
      COUNT(*) FILTER (WHERE clean_status = 'dirty') AS dirty,
      COUNT(*) FILTER (WHERE inspected = TRUE) AS inspected
    FROM rooms
  `);
  return result.rows[0];
};

// Tỷ lệ phòng sử dụng theo tháng
exports.getMonthlyOccupancy = async () => {
  const result = await db.query(`
    SELECT TO_CHAR(check_in, 'Mon') AS month, COUNT(*) AS bookings
    FROM bookings
    WHERE check_in >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY month
    ORDER BY DATE_PART('month', MIN(check_in))
  `);
  return result.rows;
};
