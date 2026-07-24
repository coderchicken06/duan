<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-content">
      <router-view />
    </main>
    <AppFooter />
    <CompareBar />

    <!-- Thêm thẻ Chatbot ở đây để nó hiển thị trôi nổi trên toàn bộ website -->
    <Chatbot />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CompareBar from './components/CompareBar.vue'
import Chatbot from './components/Chatbot.vue'
</script>