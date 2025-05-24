// src/services/api.jsx

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy to https://hotelmanagementhust.onrender.com
});

// --- Room APIs ---
export const getRooms = (params = {}) => api.get('/rooms', { params });
export const addRoom = (data) => api.post('/rooms', data);
export const updateRoom = (id, data) => api.put(`/rooms/${id}`, data);
export const deleteRoom = (id) => api.delete(`/rooms/${id}`);

// --- Room Type APIs ---
export const getRoomTypes = () => api.get('/room-types');
export const addRoomType = (data) => api.post('/room-types', data);
export const updateRoomType = (id, data) => api.put(`/room-types/${id}`, data);
export const deleteRoomType = (id) => api.delete(`/room-types/${id}`);

// --- Deal / Rate APIs ---
export const getDeals = () => api.get('/rates');
export const addDeal = (data) => api.post('/rates', data);
export const updateDeal = (id, data) => api.put(`/rates/${id}`, data);
export const deleteDeal = (id) => api.delete(`/rates/${id}`);

export default api;
