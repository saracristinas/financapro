import axios from 'axios'
import { useAppStore } from '../store/useAppStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.request.use(config => {
  const token = useAppStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      useAppStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getForgotPasswordQuestion: (email) => api.post('/auth/forgot-password-question', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// ── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  get: (month, year) => api.get('/dashboard', { params: { month, year } }),
}

// ── Transactions ──────────────────────────────────────
export const transactionsApi = {
  list: (month, year) => api.get('/transactions', { params: { month, year } }),
  create: (data) => api.post('/transactions', data),
  delete: (id) => api.delete(`/transactions/${id}`),
}

// ── Savings ───────────────────────────────────────────
export const savingsApi = {
  list: () => api.get('/savings'),
  create: (data) => api.post('/savings', data),
  update: (id, data) => api.put(`/savings/${id}`, data),
  delete: (id) => api.delete(`/savings/${id}`),
}

// ── Debts ─────────────────────────────────────────────
export const debtsApi = {
  list: () => api.get('/debts'),
  create: (data) => api.post('/debts', data),
  update: (id, data) => api.put(`/debts/${id}`, data),
  delete: (id) => api.delete(`/debts/${id}`),
}

// ── Analytics ─────────────────────────────────────────
export const analyticsApi = {
  monthly: (year) => api.get('/analytics/monthly', { params: { year } }),
}

// ── Team ──────────────────────────────────────────────
export const teamApi = {
  list: () => api.get('/team'),
  invite: (data) => api.post('/team/invite', data),
  remove: (id) => api.delete(`/team/${id}`),
}

export default api
