import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Users
export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const createUser = (data) => api.post('/users', data);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Routes
export const getRoutes = () => api.get('/routes');
export const getRoute = (id) => api.get(`/routes/${id}`);
export const createRoute = (data) => api.post('/routes', data);
export const updateRoute = (id, data) => api.put(`/routes/${id}`, data);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

// Buses
export const getBuses = () => api.get('/buses');
export const createBus = (data) => api.post('/buses', data);
export const updateBus = (id, data) => api.put(`/buses/${id}`, data);
export const deleteBus = (id) => api.delete(`/buses/${id}`);

// Bus Passes
export const getBusPasses = () => api.get('/bus-passes');
export const createBusPass = (data) => api.post('/bus-passes', data);

// Bus Stops
export const getBusStops = () => api.get('/bus-stops');
export const createBusStop = (data) => api.post('/bus-stops', data);

// Maintenance
export const getMaintenance = () => api.get('/maintenance');
export const createMaintenance = (data) => api.post('/maintenance', data);

// Metro
export const getMetroStops = () => api.get('/metro-stops');
export const getMetroConnections = () => api.get('/metro-connections');

// Contractors
export const getContractors = () => api.get('/contractors');
export const createContractor = (data) => api.post('/contractors', data);

export default api;
