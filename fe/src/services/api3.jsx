import axios from "axios";

const BASE_URL = "https://hotelmanagementhust-m6i2.onrender.com/api";

// GET: danh sách bookings
export const getBookings = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, { params });
    return response.data.bookings || []; // ✅ Sửa đúng key từ "booking" -> "bookings"
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const updateBooking = async (bookingId, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/bookings/${bookingId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// DELETE: xóa booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};