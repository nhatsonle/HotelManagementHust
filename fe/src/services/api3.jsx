// services/api3.jsx
import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

// GET: danh sách bookings
export const getBookings = async (params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/bookings`, { params });
    return response.data.booking || []; // Trả về mảng bookings
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// PUT: cập nhật booking
export const updateBooking = async (bookingId, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/bookings/${bookingId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

// DELETE: xoá booking
export const deleteBooking = async (bookingId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};