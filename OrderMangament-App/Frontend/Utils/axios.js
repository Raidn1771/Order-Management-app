import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use(req => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const login = data => API.post('/users/login', data);
export const signup = data => API.post('/users/signup', data);
export const getOrders = (page = 1, limit = 5) =>
  API.get(`/orders?page=${page}&limit=${limit}`);
export const createOrder = data => API.post('/orders', data);
export const updateOrder = (id, data) => API.put(`/orders/${id}`, data);
export const deleteOrder = id => API.delete(`/orders/${id}`);
