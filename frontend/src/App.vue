<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-content">
      <router-view />
    </main>
    <AppFooter />
    <CompareBar />

    <Transition name="toast">
      <div v-if="toastVisible" class="cart-toast-popup" :class="`is-${toastType}`" role="status" aria-live="polite">
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Thêm thẻ Chatbot ở đây để nó hiển thị trôi nổi trên toàn bộ website -->
    <Chatbot />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CompareBar from './components/CompareBar.vue'
import Chatbot from './components/Chatbot.vue'

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
  showToast(detail?.message || 'Thêm vào giỏ hàng thành công!', detail?.type)
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
</style>
