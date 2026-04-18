// client/src/services/api.js
import axios from 'axios';
const API = axios.create({
  baseURL : process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
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

// Public tracking API (no auth required)
export const trackShipment = (trackingNumber) => 
  API.get(`/shipments/track/${trackingNumber}`, { 
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
  });

// Delivery prediction API
export const predictDelivery = (id) => API.get(`/shipments/${id}/predict-delivery`);

// Sensor APIs
export const getSensorData = (shipmentId) => API.get(`/sensors/${shipmentId}`);
export const enableTempTracking = (shipmentId, threshold) => 
  API.put(`/sensors/${shipmentId}/enable`, { threshold });

// Payment APIs
export const lockPayment = (data) => API.post('/payments/lock', data);
export const releasePayment = (data) => API.post('/payments/release', data);
export const getPaymentStatus = (shipmentId) => API.get(`/payments/${shipmentId}`);
// Document APIs
export const uploadDocument  = (formData) => API.post('/documents/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const verifyDocument  = (formData) => API.post('/documents/verify', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAllDocuments  = () => API.get('/documents');