// Hàm thực thi SQL cho Bookings (CRUD đặt phòng)

const getBookings = `
  SELECT * FROM bookings;
`;

const getBookingById = `
  SELECT * FROM bookings WHERE id = $1;
`;

const createBooking = `
  INSERT INTO bookings (user_id, room_id, start_date, end_date)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

const updateBooking = `
  UPDATE bookings
  SET user_id = $1, room_id = $2, start_date = $3, end_date = $4
  WHERE id = $5
  RETURNING *;
`;

const deleteBooking = `
  DELETE FROM bookings WHERE id = $1;
`;

module.exports = {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
};