<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-content">
      <router-view />
    </main>
    <AppFooter />
    <CompareBar />

    <div v-if="toastVisible" class="cart-toast-popup">
      {{ toastMessage }}
    </div>

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
let timer = null

function showToast(message) {
  toastMessage.value = message
  toastVisible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

function onToastEvent(event) {
  showToast(event.detail || 'Thêm vào giỏ hàng thành công!')
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
  position: fixed;
  right: 18px;
  bottom: 24px;
  z-index: 9999;
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #1f2937;
  color: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}
</style>