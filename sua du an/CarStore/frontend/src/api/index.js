import api from './client'

export const authApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  signup: (account) => api.post('/api/auth/signup', account),
  logout: () => api.post('/api/auth/logout'),
  me: () => api.get('/api/auth/me'),
  checkUsername: (username) => api.get(`/api/auth/check-username/${username}`),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  verifyOtp: (otp) => api.post('/api/auth/verify-otp', { otp }),
  resetPassword: (password, confirmPassword) =>
    api.post('/api/auth/reset-password', { password, confirmPassword }),
}

export const carApi = {
  getAll: (q) => api.get('/api/cars', { params: q ? { q } : {} }),
  getById: (id) => api.get(`/api/cars/${id}`),
  getSimilar: (id) => api.get(`/api/cars/${id}/similar`),
  getImages: (id) => api.get(`/api/cars/${id}/images`),
  addImage: (id, image) => api.post(`/api/cars/${id}/images`, image),
  updateImage: (id, imageId, image) => api.put(`/api/cars/${id}/images/${imageId}`, image),
  deleteImage: (id, imageId) => api.delete(`/api/cars/${id}/images/${imageId}`),
  search: (keyword) => api.get('/api/cars/search', { params: { keyword } }),
  create: (car) => api.post('/api/cars', car),
  update: (id, car) => api.put(`/api/cars/${id}`, car),
  delete: (id) => api.delete(`/api/cars/${id}`),
}

export const cartApi = {
  get: () => api.get('/api/cart'),
  add: (id, quantity = 1) => api.post(`/api/cart/add/${id}`, null, { params: { quantity } }),
  remove: (id) => api.delete(`/api/cart/remove/${id}`),
  update: (id, quantity) => api.put(`/api/cart/update/${id}`, { quantity }),
  clear: () => api.delete('/api/cart/clear'),
  increment: (id) => api.post(`/api/cart/increment/${id}`),
  decrement: (id) => api.post(`/api/cart/decrement/${id}`),
}

export const orderApi = {
  getMyOrders: () => api.get('/api/orders/my-orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  getDetails: (id) => api.get(`/api/orders/${id}/details`),
  checkout: (address) => api.post('/api/orders/checkout', { address }),
  payDeposit: (id, method) => api.post(`/api/orders/${id}/deposit`, { method }),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
  changePassword: (payload) => api.post('/api/profile/change-password', payload),
  delete: () => api.delete('/api/profile'),
}

export const supportApi = {
  getMy: () => api.get('/api/support/my'),
  getAll: () => api.get('/api/support'),
  create: (data) => api.post('/api/support', data),
  updateStatus: (id, status) => api.put(`/api/support/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/support/${id}`),
  getStats: () => api.get('/api/support/stats'),
}

export const adminApi = {
  getUsers: () => api.get('/api/admin/users'),
  createUser: (user) => api.post('/api/admin/users', user),
  updateUser: (username, user) => api.put(`/api/admin/users/${username}`, user),
  deleteUser: (username) => api.delete(`/api/admin/users/${username}`),
  getOrders: () => api.get('/api/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/api/admin/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/api/admin/orders/${id}`),
  getCars: () => api.get('/api/admin/cars'),
  createCar: (car) => api.post('/api/admin/cars', car),
  updateCar: (id, car) => api.put(`/api/admin/cars/${id}`, car),
  deleteCar: (id) => api.delete(`/api/admin/cars/${id}`),
  getBrands: () => api.get('/api/admin/brands'),
  getStats: () => api.get('/api/admin/stats'),
  getRevenue: () => api.get('/api/admin/revenue'),
  getTopCars: () => api.get('/api/admin/top-cars'),
  getDashboardInfo: () => api.get('/api/admin/dashboard-info'),
}

export const uploadApi = {
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/api/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export function formatPrice(price) {
  if (price == null) return '0'
  return Number(price).toLocaleString('vi-VN')
}

export function carImageUrl(image) {
  return image ? `/images/${image}` : '/images/camry.jpg'
}
