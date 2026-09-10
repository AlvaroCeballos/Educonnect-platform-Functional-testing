import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // el proxy de Vite redirige al backend
  headers: { 'Content-Type': 'application/json' },
});

// Adjunta el JWT automáticamente si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

// Manejo global de 401 (token expirado - logout)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
