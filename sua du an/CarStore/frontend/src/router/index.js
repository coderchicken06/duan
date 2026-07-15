import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/car/list', name: 'car-list', component: () => import('../views/CarListView.vue') },
    { path: '/car/detail/:id', name: 'car-detail', component: () => import('../views/CarDetailView.vue') },
    { path: '/car/create', name: 'car-create', meta: { admin: true }, component: () => import('../views/CarFormView.vue') },
    { path: '/car/edit/:id', name: 'car-edit', meta: { admin: true }, component: () => import('../views/CarFormView.vue') },
    { path: '/cart/view', name: 'cart', component: () => import('../views/CartView.vue') },
    { path: '/checkout', name: 'checkout', meta: { auth: true }, component: () => import('../views/CheckoutView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/login/form', redirect: '/login' },
    { path: '/signup', name: 'signup', component: () => import('../views/SignupView.vue') },
    { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/ForgotPasswordView.vue') },
    { path: '/verify-otp', name: 'verify-otp', component: () => import('../views/VerifyOtpView.vue') },
    { path: '/reset-password', name: 'reset-password', component: () => import('../views/ResetPasswordView.vue') },
    { path: '/profile', name: 'profile', meta: { auth: true }, component: () => import('../views/ProfileView.vue') },
    { path: '/order/my-orders', name: 'my-orders', meta: { auth: true }, component: () => import('../views/MyOrdersView.vue') },
    { path: '/order/detail/:id', name: 'order-detail', meta: { auth: true }, component: () => import('../views/OrderDetailView.vue') },
    { path: '/history', name: 'history', meta: { auth: true }, component: () => import('../views/HistoryView.vue') },
    { path: '/service', name: 'service', component: () => import('../views/ServiceView.vue') },
    { path: '/support', name: 'support', meta: { auth: true }, component: () => import('../views/SupportView.vue') },
    { path: '/admin/dashboard', name: 'admin-dashboard', meta: { admin: true }, component: () => import('../views/admin/AdminDashboard.vue') },
    { path: '/admin/inventory', name: 'admin-inventory', meta: { admin: true }, component: () => import('../views/admin/AdminInventory.vue') },
    { path: '/admin/orders', name: 'admin-orders', meta: { admin: true }, component: () => import('../views/admin/AdminOrders.vue') },
    { path: '/admin/support', name: 'admin-support', meta: { admin: true }, component: () => import('../views/admin/AdminSupport.vue') },
    { path: '/admin/users', name: 'admin-users', meta: { admin: true }, component: () => import('../views/admin/AdminUsers.vue') },
    { path: '/admin/users/create', name: 'admin-user-create', meta: { admin: true }, component: () => import('../views/admin/AdminUserForm.vue') },
    { path: '/admin/users/edit/:username', name: 'admin-user-edit', meta: { admin: true }, component: () => import('../views/admin/AdminUserForm.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user && !auth.loading) {
    await auth.fetchUser()
  }
  if (to.meta.auth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.admin && !auth.isAdmin) {
    return auth.isLoggedIn ? { name: 'home' } : { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
