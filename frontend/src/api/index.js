import api from './client'

export const chatApi = {
  send: (message) => api.post('/api/chat', { message }),
}

export const authApi = {
  login: (username, password) => api.post('/api/auth/login', { username, password }),
  signup: (account) => api.post('/api/auth/signup', account),
  verifyEmail: (username, code) => api.post('/api/auth/verify-email', { username, code }),
  resendVerification: (username) => api.post('/api/auth/resend-verification', { username }),
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
}

export const brandApi = {
  getAll: () => api.get('/api/brands'),
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
  checkout: (address, paymentMethod) => api.post('/api/orders/checkout', { address, paymentMethod }),
  updateStatus: (id, status) => api.put(`/api/orders/${id}/status`, { status }),
}

export const contractApi = {
  getByOrder: (orderId, config) => api.get(`/api/contracts/${orderId}`, config),
  getPayments: (orderId) => api.get(`/api/contracts/${orderId}/payments`),
  getAll: () => api.get('/api/contracts'),
  update: (id, data) => api.put(`/api/contracts/manage/${id}`, data),
}

export const paymentTransactionApi = {
  getByOrder: (orderId, config) => api.get(`/api/payment-transactions/orders/${orderId}`, config),
  createQr: (orderId) => api.post('/api/payment/create-qr', { orderId }),
}

export const reviewApi = {
  getByCar: (carId) => api.get(`/api/reviews/car/${carId}`),
  create: (carId, data) => api.post(`/api/reviews/car/${carId}`, data),
  update: (id, data) => api.put(`/api/reviews/${id}`, data),
  delete: (id) => api.delete(`/api/reviews/${id}`),
}

export const quotationApi = {
  create: (data) => api.post('/api/quotations', data),
  getMine: () => api.get('/api/quotations/my'),
  getById: (id) => api.get(`/api/quotations/${id}`),
  confirm: (id) => api.post(`/api/quotations/${id}/confirm`),
  getAll: () => api.get('/api/quotations'),
  update: (id, data) => api.put(`/api/quotations/${id}`, data),
  convertToOrder: (id, data) => api.post(`/api/quotations/${id}/convert-to-order`, data),
}

export const promotionApi = {
  getActive: () => api.get('/api/promotions'),
  getForCar: (carId) => api.get(`/api/promotions/car/${carId}`),
  getAll: () => api.get('/api/promotions/admin'),
  create: (data) => api.post('/api/promotions', data),
  update: (id, data) => api.put(`/api/promotions/${id}`, data),
  delete: (id) => api.delete(`/api/promotions/${id}`),
  applyToCar: (id, carId) => api.post(`/api/promotions/${id}/cars/${carId}`),
  assignToCar: (id, carId) => api.put(`/api/promotions/${id}/car/${carId}`),
  getAssignedCars: (id) => api.get(`/api/promotions/${id}/cars`),
}

export const newsApi = {
  getPublished: () => api.get('/api/news'),
  getBySlug: (slug) => api.get(`/api/news/${slug}`),
  getAll: () => api.get('/api/news/admin/all'),
  create: (data) => api.post('/api/news', data),
  update: (id, data) => api.put(`/api/news/${id}`, data),
  delete: (id) => api.delete(`/api/news/${id}`),
}

export const profileApi = {
  get: () => api.get('/api/profile'),
  update: (data) => api.put('/api/profile', data),
  changePassword: (payload) => api.post('/api/profile/change-password', payload),
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
  getCars: () => api.get('/api/admin/cars'),
  createCar: (car) => api.post('/api/admin/cars', car),
  updateCar: (id, car) => api.put(`/api/admin/cars/${id}`, car),
  deleteCar: (id) => api.delete(`/api/admin/cars/${id}`),
  getBrands: () => api.get('/api/admin/brands'),
  createBrand: (brand) => api.post('/api/admin/brands', brand),
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

const imageAliases = {
  'x5.jpg': 'bmwx5.png',
  'x5.png': 'bmwx5.png',
  'x5-gallery1.jpg': 'bmwx5-gallery1.png',
  'x5-gallery2.jpg': 'bmwx5-gallery2.png',
  'x5-gallery3.jpg': 'bmwx5-gallery3.png',
  'x5-gallery4.jpg': 'bmwx5-gallery4.png',
  'x5-gallery5.jpg': 'bmwx5-gallery5.png',
  'c300.jpg': 'mercedesC300.png',
  'c300.png': 'mercedesC300.png',
  'c300-gallery1.jpg': 'mercedesC300-gallery1.png',
  'c300-gallery2.jpg': 'mercedesC300-gallery2.png',
  'c300-gallery3.jpg': 'mercedesC300-gallery3.png',
  'c300-gallery4.jpg': 'mercedesC300-gallery4.png',
  'c300-gallery5.jpg': 'mercedesC300-gallery5.png',
  'bmw3.jpg': 'bmw3series.png',
  'bmw3series.jpg': 'bmw3series.png',
  'bmw3-gallery1.jpg': 'bmw3series-gallery1.png',
  'bmw3-gallery2.jpg': 'bmw3series-gallery2.png',
  'bmw3-gallery3.jpg': 'bmw3series-gallery3.png',
  'bmw3-gallery4.jpg': 'bmw3series-gallery4.png',
  'bmw3series-gallery1.jpg': 'bmw3series-gallery1.png',
  'bmw3series-gallery2.jpg': 'bmw3series-gallery2.png',
  'bmw3series-gallery3.jpg': 'bmw3series-gallery3.png',
  'bmw3series-gallery4.jpg': 'bmw3series-gallery4.png',
  'civic-gallery1.jpg': 'civic-gallery1.png',
  'civic-gallery2.jpg': 'civic-gallery2.png',
  'civic-gallery3.jpg': 'civic-gallery3.png',
  'civic-gallery4.jpg': 'civic-gallery4.png',
  'civic-gallery5.jpg': 'civic-gallery5.png',
  'corolla-gallery1.jpg': 'Corolla-gallery1.png',
  'corolla-gallery2.jpg': 'Corolla-gallery2.png',
  'corolla-gallery3.jpg': 'Corolla-gallery3.png',
  'corolla-gallery4.jpg': 'Corolla-gallery4.png',
  'corolla-gallery5.jpg': 'Corolla-gallery5.png',
  'camry-gallery1.png': 'camry-gallery1.jpg',
  'camry-gallery2.jpg': 'camry-gallery2.png',
  'camry-gallery3.jpg': 'camry-gallery3.png',
  'camry-gallery4.jpg': 'camry-gallery4.png',
  'camry-gallery5.jpg': 'camry-gallery5.png',
  'wildtrak2025-gallery1.jpg': 'Wildtrak2025-gallery1.png',
  'wildtrak2025-gallery2.jpg': 'Wildtrak2025-gallery2.png',
  'wildtrak2025-gallery3.jpg': 'Wildtrak2025-gallery3.png',
  'wildtrak2025-gallery4.jpg': 'Wildtrak2025-gallery4.png',
  'wildtrak2025-gallery5.jpg': 'Wildtrak2025-gallery5.png',
  'vf8-gallery1.jpg': 'VF8-gallery1.png',
  'vf8-gallery2.jpg': 'VF8-gallery2.png',
  'vf8-gallery3.jpg': 'VF8-gallery3.png',
  'vf8-gallery4.jpg': 'VF8-gallery4.png',
  'vf8-gallery5.jpg': 'VF8-gallery5.png',
  'tucson-gallery1.jpg': 'Tucson-gallery1.png',
  'tucson-gallery2.jpg': 'Tucson-gallery2.png',
  'tucson-gallery3.jpg': 'Tucson-gallery3.png',
  'tucson-gallery4.jpg': 'Tucson-gallery4.png',
  'tucson-gallery5.jpg': 'Tucson-gallery5.png',
  'wildtrak2025.jpg': 'Wildtrak2025.png',
  'wildtrak2025.png': 'Wildtrak2025.png',
  'vf8.jpg': 'VF8.png',
  'vf8.png': 'VF8.png',
  'tucson.jpg': 'Tucson.png',
  'tucson.png': 'Tucson.png',
  'corolla.jpg': 'Corolla.png',
  'corolla.png': 'Corolla.png',
  'civic.jpg': 'civic.png',
}

export function carImageUrl(image) {
  if (!image) return '/images/car-placeholder.svg'
  const value = String(image).trim().replaceAll('\\', '/')
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:')) return value

  const normalized = value.replace(/^\/+/, '').replace(/^images\//i, '')
  const resolved = imageAliases[normalized.toLowerCase()] || normalized
  if (resolved.startsWith('/images/')) return resolved
  if (resolved.startsWith('images/')) return `/${resolved}`
  return `/images/${resolved.replace(/^\/+/, '')}`
}

export function useDefaultCarImage(event) {
  const image = event?.target
  if (!image) return
  const fallback = '/images/car-placeholder.svg'
  if (new URL(image.src, window.location.origin).pathname === fallback) return
  image.src = fallback
}
