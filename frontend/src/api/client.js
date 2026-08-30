import axios from 'axios'

const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:8082`
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082'
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || ''
    if (err.response?.status === 401 && !url.includes('/api/auth/login') && !url.includes('/api/auth/me')) {
      window.sessionStorage.clear()
      const path = window.location.pathname
      if (path !== '/login' && path !== '/signup') {
        window.location.replace('/login')
      }
    }
    return Promise.reject(err)
  }
)

export default api
