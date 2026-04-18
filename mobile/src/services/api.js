import axios from 'axios';

const API_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = global.token || require('@react-native-async-storage/async-storage').default.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);

export const getShipments = () => api.get('/shipments');
export const getShipment = (id) => api.get(`/shipments/${id}`);
export const createShipment = (data) => api.post('/shipments', data);
export const updateShipmentStatus = (id, data) => api.put(`/shipments/${id}/status`, data);

export const getDocuments = () => api.get('/documents');
export const uploadDocument = async (formData) => {
  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const trackShipment = (trackingNumber) => 
  api.get(`/shipments/track/${trackingNumber}`);

export const predictDelivery = (id) => api.get(`/shipments/${id}/predict-delivery`);

export const getSensorData = (shipmentId) => api.get(`/sensors/${shipmentId}`);

export const lockPayment = (data) => api.post('/payments/lock', data);
export const releasePayment = (data) => api.post('/payments/release', data);
export const getPaymentStatus = (shipmentId) => api.get(`/payments/${shipmentId}`);

export default api;