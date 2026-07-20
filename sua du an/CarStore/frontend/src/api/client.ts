import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''
    if (err.response?.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/me')) {
      const path = window.location.pathname
      if (path !== '/login' && path !== '/signup') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
