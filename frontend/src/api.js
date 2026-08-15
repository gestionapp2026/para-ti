import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const gfCode = localStorage.getItem('gf_code');
  if (gfCode) {
    config.headers['x-gf-code'] = gfCode;
  }

  return config;
});

export default api;
