import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cc_token');
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ── Resources ─────────────────────────────────────────
export const resourceApi = {
  getAll: (type) => api.get('/resources', { params: type ? { type } : {} }),
  getById: (id) => api.get(`/resources/${id}`),
  getAvailable: (date, startTime, endTime) =>
    api.get('/resources/available', { params: { date, startTime, endTime } }),
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  toggleAvailability: (id) => api.patch(`/resources/${id}/toggle-availability`),
  delete: (id) => api.delete(`/resources/${id}`),
};

// ── Bookings ──────────────────────────────────────────
export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAllBookings: () => api.get('/bookings/all'),
  getPendingBookings: () => api.get('/bookings/pending'),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

// ── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
