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
      AND status = 'Booked'
  `);
  return parseInt(result.rows[0].count);
};

// Thống kê loại phòng
exports.getRoomTypes = async () => {
  const result = await db.query(`
    SELECT 
      rt.type_name AS room_type,
      COUNT(*) FILTER (WHERE r.room_status = 'Booked') AS occupied,
      COUNT(*) AS total,
      COALESCE(MAX(rates.deal_price), rt.base_price) AS price
    FROM rooms r
    JOIN roomtypes rt ON r.type_id = rt.type_id
    LEFT JOIN rates ON rates.type_id = rt.type_id
    GROUP BY rt.type_name, rt.base_price
  `);
  return result.rows;
};


// Phân loại phòng theo trạng thái
exports.getRoomStatus = async () => {
  const result = await db.query(`
    SELECT 
      COUNT(*) FILTER (WHERE room_status = 'Booked') AS occupied,
      COUNT(*) FILTER (WHERE room_status = 'Available') AS available
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
