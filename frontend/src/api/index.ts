import api from './client'

type Id = number | string
type JsonObject = Record<string, unknown>

export const authApi = {
  login: (username: string, password: string) => api.post('/api/auth/login', { username, password }),
  signup: (account: JsonObject) => api.post('/api/auth/signup', account),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  checkUsername: (username: string) => api.get(`/api/auth/check-username/${username}`),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  verifyOtp: (otp: string) => api.post('/api/auth/verify-otp', { otp }),
  resetPassword: (password: string, confirmPassword: string) =>
    api.post('/api/auth/reset-password', { password, confirmPassword }),
}

export const carApi = {
  getAll: (q?: string) => api.get('/api/cars', { params: q ? { q } : {} }),
  getById: (id: Id) => api.get(`/api/cars/${id}`),
  getSimilar: (id: Id) => api.get(`/api/cars/${id}/similar`),
  getImages: (id: Id) => api.get(`/api/cars/${id}/images`),
  addImage: (id: Id, image: JsonObject) => api.post(`/api/cars/${id}/images`, image),
  updateImage: (id: Id, imageId: Id, image: JsonObject) => api.put(`/api/cars/${id}/images/${imageId}`, image),
  deleteImage: (id: Id, imageId: Id) => api.delete(`/api/cars/${id}/images/${imageId}`),
}

export const brandApi = {
  getAll: () => api.get('/api/brands'),
}

export const cartApi = {
  get: () => api.get('/api/cart'),
  add: (id: Id, quantity = 1) => api.post(`/api/cart/add/${id}`, null, { params: { quantity } }),
  remove: (id: Id) => api.delete(`/api/cart/remove/${id}`),
  update: (id: Id, quantity: number) => api.put(`/api/cart/update/${id}`, { quantity }),
  clear: () => api.delete('/api/cart/clear'),
  increment: (id: Id) => api.post(`/api/cart/increment/${id}`),
  decrement: (id: Id) => api.post(`/api/cart/decrement/${id}`),
}

export const orderApi = {
  getMyOrders: () => api.get('/api/orders/my-orders'),
  getById: (id: Id) => api.get(`/api/orders/${id}`),
  getDetails: (id: Id) => api.get(`/api/orders/${id}/details`),
  checkout: (address: string) => api.post('/api/orders/checkout', { address }),
  payDeposit: (id: Id, method: string) => api.post(`/api/orders/${id}/deposit`, { method }),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data: JsonObject) => api.put('/api/profile', data),
  changePassword: (payload: JsonObject) => api.post('/api/profile/change-password', payload),
  delete: () => api.delete('/api/profile'),
}

export const supportApi = {
  getMy: () => api.get('/api/support/my'),
  getAll: () => api.get('/api/support'),
  create: (data: JsonObject) => api.post('/api/support', data),
  updateStatus: (id: Id, status: string) => api.put(`/api/support/${id}/status`, { status }),
  delete: (id: Id) => api.delete(`/api/support/${id}`),
  getStats: () => api.get('/api/support/stats'),
}

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  createUser: (user: JsonObject) => api.post('/api/admin/users', user),
  updateUser: (username: string, user: JsonObject) => api.put(`/api/admin/users/${username}`, user),
  deleteUser: (username: string) => api.delete(`/api/admin/users/${username}`),
  getOrders: () => api.get('/api/admin/orders'),
  updateOrderStatus: (id: Id, status: string) => api.put(`/api/admin/orders/${id}/status`, { status }),
  deleteOrder: (id: Id) => api.delete(`/api/admin/orders/${id}`),
  getCars: () => api.get('/api/admin/cars'),
  createCar: (car: JsonObject) => api.post('/api/admin/cars', car),
  updateCar: (id: Id, car: JsonObject) => api.put(`/api/admin/cars/${id}`, car),
  deleteCar: (id: Id) => api.delete(`/api/admin/cars/${id}`),
  getBrands: () => api.get('/api/admin/brands'),
  getDashboardInfo: () => api.get('/api/admin/dashboard-info'),
}

export const uploadApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export function formatPrice(price: number | string | null | undefined) {
  if (price == null) return '0'
  return Number(price).toLocaleString('vi-VN')
}

export function carImageUrl(image: unknown) {
  if (!image) return '/images/default-car.jpg'
  const value = String(image).trim().replaceAll('\\', '/')
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value
  if (value.startsWith('/images/')) return value
  if (value.startsWith('images/')) return `/${value}`
  return `/images/${value.replace(/^\/+/, '')}`
}
