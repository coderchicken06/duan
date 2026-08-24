import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authMeta = { auth: true, requiresAuth: true }
const adminMeta = { ...authMeta, admin: true }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/car/list', alias: '/cars', name: 'car-list', component: () => import('../views/CarListView.vue') },
    { path: '/car/detail/:id', alias: '/cars/:id', name: 'car-detail', component: () => import('../views/CarDetailView.vue') },
    { path: '/compare', name: 'compare', component: () => import('../views/CompareView.vue') },
    { path: '/car/create', name: 'car-create', meta: adminMeta, component: () => import('../views/CarFormView.vue') },
    { path: '/car/edit/:id', name: 'car-edit', meta: adminMeta, component: () => import('../views/CarFormView.vue') },
    { path: '/cart/view', name: 'cart', meta: authMeta, component: () => import('../views/CartView.vue') },
    { path: '/checkout', name: 'checkout', meta: authMeta, component: () => import('../views/CheckoutView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/login/form', redirect: '/login' },
    { path: '/signup', name: 'signup', component: () => import('../views/SignupView.vue') },
    { path: '/verify-email', name: 'verify-email', component: () => import('../views/EmailVerificationView.vue') },
    { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/ForgotPasswordView.vue') },
    { path: '/verify-otp', name: 'verify-otp', component: () => import('../views/VerifyOtpView.vue') },
    { path: '/reset-password', name: 'reset-password', component: () => import('../views/ResetPasswordView.vue') },
    { path: '/profile', name: 'profile', meta: authMeta, component: () => import('../views/ProfileView.vue') },
    { path: '/order/my-orders', alias: '/my-orders', name: 'my-orders', meta: authMeta, component: () => import('../views/MyOrdersView.vue') },
    { path: '/order/detail/:id', name: 'order-detail', meta: authMeta, component: () => import('../views/OrderDetailView.vue') },
    { path: '/orders/:id/contract', alias: '/contract/:id', name: 'order-contract', component: () => import('../views/ContractView.vue') },
    { path: '/orders/:id/payment', name: 'order-payment', meta: authMeta, component: () => import('../views/PaymentView.vue') },
    { path: '/quotations/:id', name: 'quotation-detail', meta: authMeta, component: () => import('../views/QuotationView.vue') },
    { path: '/quotation-history', alias: '/quotation/history', name: 'quotation-history', meta: authMeta, component: () => import('../views/QuotationHistoryView.vue') },
    { path: '/history', name: 'history', meta: authMeta, component: () => import('../views/HistoryView.vue') },
    { path: '/service', name: 'service', meta: authMeta, component: () => import('../views/ServiceView.vue') },
    { path: '/support', name: 'support', meta: authMeta, component: () => import('../views/SupportView.vue') },
    { path: '/news/:slug', name: 'news-detail', component: () => import('../views/NewsDetailView.vue') },
    { path: '/news', name: 'news-list', component: () => import('../views/NewsListView.vue') },
    { path: '/admin/dashboard', name: 'admin-dashboard', meta: adminMeta, component: () => import('../views/admin/AdminDashboard.vue') },
    { path: '/admin/products', name: 'admin-products', meta: adminMeta, component: () => import('../views/admin/AdminProducts.vue') },
    { path: '/admin/inventory', name: 'admin-inventory', meta: adminMeta, component: () => import('../views/admin/AdminInventory.vue') },
    { path: '/admin/orders', name: 'admin-orders', meta: adminMeta, component: () => import('../views/admin/AdminOrders.vue') },
    { path: '/admin/support', name: 'admin-support', meta: adminMeta, component: () => import('../views/admin/AdminSupport.vue') },
    { path: '/admin/users', name: 'admin-users', meta: adminMeta, component: () => import('../views/admin/AdminUsers.vue') },
    { path: '/admin/users/create', name: 'admin-user-create', meta: adminMeta, component: () => import('../views/admin/AdminUserForm.vue') },
    { path: '/admin/users/edit/:username', name: 'admin-user-edit', meta: adminMeta, component: () => import('../views/admin/AdminUserForm.vue') },
    { path: '/admin/marketing', name: 'admin-marketing', meta: adminMeta, component: () => import('../views/admin/AdminMarketing.vue') },
    { path: '/admin/contracts', name: 'admin-contracts', meta: adminMeta, component: () => import('../views/admin/AdminContracts.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.user && !auth.loading) {
    await auth.fetchUser()
  }
  if ((to.meta.auth || to.meta.requiresAuth) && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'cart' && auth.isAdmin) {
    return { name: 'admin-dashboard' }
  }
  if (to.meta.admin && !auth.isAdmin) {
    return auth.isLoggedIn ? { name: 'home' } : { name: 'login', query: { redirect: to.fullPath } }
  }
})

export default router
