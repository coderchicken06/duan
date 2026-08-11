import axios from 'axios'

const api = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Dữ liệu quản trị thay đổi thường xuyên; luôn lấy bản mới thay vì response GET
// đã cache để các màn hình polling có thể cập nhật mà không cần F5.
api.interceptors.request.use((config) => {
  if (String(config.method || 'get').toLowerCase() === 'get') {
    config.params = { ...(config.params || {}), _ts: Date.now() }
    config.headers['Cache-Control'] = 'no-cache'
    config.headers.Pragma = 'no-cache'
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
