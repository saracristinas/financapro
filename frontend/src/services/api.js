import axios from 'axios'
import { useAppStore } from '../store/useAppStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Interceptor para adicionar token a CADA requisição
api.interceptors.request.use(config => {
  try {
    const state = useAppStore.getState()
    const token = state?.token

    if (token && typeof token === 'string') {
      config.headers.Authorization = `Bearer ${token}`
      console.log('[API] ✓ Token enviado para:', config.url)
    } else if (token) {
      console.warn('[API] ⚠️ Token inválido (não é string):', typeof token, token)
    } else {
      console.warn('[API] ⚠️ Sem token para:', config.url)
    }
  } catch (error) {
    console.error('[API] Erro ao obter token:', error)
  }

  return config
})

api.interceptors.response.use(
  r => r,
  err => {
    console.error('[API] Erro:', err.response?.status, err.response?.statusText)

    if (err.response?.status === 401) {
      console.error('[API] 401 Unauthorized - fazendo logout')
      useAppStore.getState().logout()
      window.location.href = '/login'
    }
    if (err.response?.status === 403) {
      console.error('[API] 403 Forbidden - sem permissão')
    }

    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  getForgotPasswordQuestion: (email) => api.post('/api/auth/forgot-password-question', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
}

// ── Dashboard ─────────────────────────────────────────
export const dashboardApi = {
  get: (month, year) => api.get('/api/dashboard', { params: { month, year } }),
}

// ── Transactions ──────────────────────────────────────
export const transactionsApi = {
  list: (month, year) => api.get('/api/transactions', { params: { month, year } }),
  create: (data) => api.post('/api/transactions', data),
  delete: (id) => api.delete(`/api/transactions/${id}`),
}

// ── Savings ───────────────────────────────────────────
export const savingsApi = {
  list: () => api.get('/api/savings'),
  create: (data) => api.post('/api/savings', data),
  update: (id, data) => api.put(`/api/savings/${id}`, data),
  delete: (id) => api.delete(`/api/savings/${id}`),
}

// ── Debts ─────────────────────────────────────────────
export const debtsApi = {
  list: () => api.get('/api/debts'),
  create: (data) => api.post('/api/debts', data),
  update: (id, data) => api.put(`/api/debts/${id}`, data),
  delete: (id) => api.delete(`/api/debts/${id}`),
}

// ── Analytics ─────────────────────────────────────────
export const analyticsApi = {
  monthly: (year) => api.get('/api/analytics/monthly', { params: { year } }),
}

// ── Team ──────────────────────────────────────────────
export const teamApi = {
  list: () => api.get('/api/team'),
  invite: (data) => api.post('/api/team/invite', data),
  remove: (id) => api.delete(`/api/team/${id}`),
}

export default api
