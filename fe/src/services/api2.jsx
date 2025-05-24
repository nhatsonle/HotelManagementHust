import axios from "axios";

const BASE_URL = "https://hotelmanagementhust-96jw.onrender.com/api";

// API: Dashboard
export const getMonthlyBookingStats = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/occupancy-monthly`);
    return res.data.map(item => ({
      month: item.month,
      count: parseInt(item.bookings, 10),
    }));
  } catch (err) {
    console.error("Lỗi khi fetch monthly booking:", err);
    return [];
  }
};

export const getTodaySummary = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/today-summary`);
    return res.data;
  } catch (err) {
    console.error("Lỗi khi fetch today summary:", err);
    return { checkIn: 0, checkOut: 0, inHotel: 0 };
  }
};

export const getRoomStatus = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/room-status`);
    return {
      occupied: parseInt(res.data.occupied, 10),
      available: parseInt(res.data.available, 10),
    };
  } catch (err) {
    console.error("Lỗi khi fetch room status:", err);
    return { occupied: 0, available: 0 };
  }
};

export const getRoomTypes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/dashboard/room-types`);
    return res.data.map(room => ({
      ...room,
      occupied: parseInt(room.occupied, 10),
      total: parseInt(room.total, 10),
      price: parseFloat(room.price),
    }));
  } catch (err) {
    console.error("Lỗi khi fetch room types:", err);
    return [];
  }
};

// Guest APIs
export const getGuests = () => axios.get(`${BASE_URL}/guests`);
export const createGuest = (data) => axios.post(`${BASE_URL}/guests`, {
  name: data.name,
  passport_number: data.passport_number,
  phone: data.phone,
  email: data.email,
  city: data.city,
  region: data.region,
  address: data.address,
  zip_code: data.zip_code
});

export const updateGuest = (id, data) => axios.put(`${BASE_URL}/guests/${id}`, {
  name: data.name,
  passport_number: data.passport_number,
  phone: data.phone,
  email: data.email,
  city: data.city,
  region: data.region,
  address: data.address,
  zip_code: data.zip_code
});

export const deleteGuest = (id) => axios.delete(`${BASE_URL}/guests/${id}`);
