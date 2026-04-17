// client/src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL : 'http://localhost:5000/api'
});

// Auto attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login',    data);
export const getMe        = ()     => API.get('/auth/me');

// Shipment APIs
export const createShipment  = (data) => API.post('/shipments',            data);
export const getAllShipments  = ()     => API.get('/shipments');
export const getShipment     = (id)   => API.get(`/shipments/${id}`);
export const updateStatus    = (id, data) => API.put(`/shipments/${id}/status`, data);
export const deleteShipment  = (id)   => API.delete(`/shipments/${id}`);
// Document APIs
export const uploadDocument  = (formData) => API.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const verifyDocument  = (formData) => API.post('/documents/verify', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAllDocuments  = () => API.get('/documents');