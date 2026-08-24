<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-content" :class="{ 'admin-page-content': isAdminArea }">
      <div v-if="isAdminArea" class="admin-layout">
        <aside class="admin-sidebar" aria-label="Điều hướng quản trị">
          <div class="admin-sidebar-title">Quản trị CarStore</div>
          <nav class="admin-sidebar-nav">
            <router-link to="/admin/dashboard" exact-active-class="is-active">📊 <span>Thống kê</span></router-link>
            <router-link to="/admin/inventory" exact-active-class="is-active">📦 <span>Quản lý tồn
                kho</span></router-link>
            <router-link to="/admin/products" exact-active-class="is-active">🚗 <span>Quản lý sản
                phẩm</span></router-link>
            <router-link to="/admin/orders" exact-active-class="is-active">📦 <span>Quản lý đơn
                hàng</span></router-link>
            <router-link to="/admin/support" exact-active-class="is-active">📋 <span>Quản lý yêu cầu hỗ
                trợ</span></router-link>
            <router-link to="/admin/users" exact-active-class="is-active">👥 <span>Quản lý khách
                hàng</span></router-link>
            <router-link to="/admin/marketing" exact-active-class="is-active">📣 <span>Khuyến mãi & tin
                tức</span></router-link>
            <router-link to="/admin/contracts" exact-active-class="is-active">📄 <span>Quản lý hợp
                đồng</span></router-link>
          </nav>
        </aside>
        <section class="admin-main-content">
          <router-view />
        </section>
      </div>
      <router-view v-else />
    </main>
    <AppFooter v-if="!isAdminArea" />
    <CompareBar />

    <Transition name="toast">
      <div v-if="toastVisible" class="cart-toast-popup" :class="`is-${toastType}`" role="status" aria-live="polite">
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Thêm thẻ Chatbot ở đây để nó hiển thị trôi nổi trên toàn bộ website -->
    <Chatbot v-if="!isHideChatbot" />
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CompareBar from './components/CompareBar.vue'
import Chatbot from './components/Chatbot.vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const auth = useAuthStore()
const isAdminArea = computed(() => auth.isAdmin && route.path.startsWith('/admin/'))
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isHideChatbot = computed(() => isAdminRoute.value || auth.isAdmin)

const toastVisible = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
let timer = null

function showToast(message, type = 'success') {
  toastMessage.value = message
  toastType.value = ['success', 'error', 'warning'].includes(type) ? type : 'success'
  toastVisible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    toastVisible.value = false
  }, 3000)
}

function onToastEvent(event) {
  const detail = event.detail
  if (typeof detail === 'string') {
    showToast(detail)
    return
  }
  showToast(detail?.message || 'Thêm vào phiếu đặt cọc xe thành công!', detail?.type)
}

onMounted(() => {
  window.addEventListener('carstore-toast', onToastEvent)
})

onBeforeUnmount(() => {
  window.removeEventListener('carstore-toast', onToastEvent)
  clearTimeout(timer)
})
</script>

<style scoped>
.cart-toast-popup {
  position: fixed !important;
  top: 20px !important;
  right: 20px !important;
  left: auto !important;
  bottom: auto !important;
  z-index: 9999 !important;
  width: auto;
  max-width: 400px;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #10b981;
  color: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.16);
  font-weight: 700;
  transition: all 0.3s ease;
}

.cart-toast-popup.is-error {
  background-color: #ef4444;
}

.cart-toast-popup.is-warning {
  background-color: #f59e0b;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.admin-page-content {
  background: #f6f7f9;
  flex: 0 0 auto;
  height: calc(100vh - 72px);
  overflow: hidden;
}

.admin-layout {
  height: 100%;
  position: relative;
}

.admin-sidebar {
  background: #fff;
  border-right: 1px solid #e5e7eb;
  box-sizing: border-box;
  bottom: 0;
  height: calc(100vh - 72px);
  left: 0;
  min-width: 260px;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  position: fixed;
  scrollbar-color: rgb(0 0 0 / 20%) transparent;
  scrollbar-width: thin;
  top: 72px;
  width: 260px;
  z-index: 90;
}

.admin-sidebar::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

.admin-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.admin-sidebar::-webkit-scrollbar-thumb {
  background: rgb(0 0 0 / 20%);
  border-radius: 9999px;
}

.admin-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgb(0 0 0 / 35%);
}

.admin-sidebar-title {
  color: #111827;
  font-size: 1rem;
  font-weight: 800;
  margin: 0 .6rem 1.15rem;
}

.admin-sidebar-nav {
  display: grid;
  gap: .35rem;
}

.admin-sidebar-nav a {
  align-items: center;
  border-radius: 6px;
  color: #4b5563;
  display: flex;
  font-size: .92rem;
  font-weight: 700;
  gap: .65rem;
  padding: .72rem .7rem;
  text-decoration: none;
}

.admin-sidebar-nav a:hover,
.admin-sidebar-nav a:focus-visible {
  background: #f3f4f6;
  color: #b91c1c;
}

.admin-sidebar-nav a.is-active {
  background: #fee2e2;
  color: #991b1b;
}

.admin-main-content {
  box-sizing: border-box;
  height: 100%;
  margin-left: 260px;
  min-width: 0;
  overflow-y: auto;
  padding: 24px;
  width: calc(100% - 260px);
}

.admin-main-content :deep(.cs-container) {
  max-width: none;
  width: 100%;
}

@media (max-width: 900px) {
  .admin-page-content {
    flex: 1;
    height: auto;
    overflow: visible;
  }

  .admin-layout {
    height: auto;
  }

  .admin-sidebar {
    border-bottom: 1px solid #e5e7eb;
    border-right: 0;
    height: auto;
    overflow-x: auto;
    overflow-y: hidden;
    padding: .8rem 1rem;
    position: static;
    width: auto;
    z-index: auto;
  }

  .admin-main-content {
    height: auto;
    margin-left: 0;
    overflow: visible;
    padding: 0;
    width: 100%;
  }

  .admin-sidebar-title {
    margin-bottom: .65rem;
  }

  .admin-sidebar-nav {
    display: flex;
    width: max-content;
  }
}
</style>
