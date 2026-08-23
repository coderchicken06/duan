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
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
})

// Dữ liệu quản trị thay đổi thường xuyên; luôn lấy bản mới thay vì response GET
// đã cache để các màn hình polling có thể cập nhật mà không cần F5.
api.interceptors.request.use((config) => {
  if (String(config.method || 'get').toLowerCase() === 'get') {
    config.params = { ...(config.params || {}), _ts: Date.now() }
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    config.headers.Pragma = 'no-cache'
    config.headers.Expires = '0'
  }
  return config
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
