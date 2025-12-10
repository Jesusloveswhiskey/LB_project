import api from './axios';

export const fetchCsrf = () => api.get('/auth/csrf/'); // установка csrftoken cookie
export const login = (username, password) =>
  api.post('/auth/login/', { username, password });
export const logout = () => api.post('/auth/logout/');
export const getCurrentUser = () => api.get('/auth/user/');
