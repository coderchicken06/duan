<template>
  <div class="app-shell">
    <AppHeader />
    <main class="page-content">
      <router-view />
    </main>
    <AppFooter />
    <CompareBar />
  </div>
</template>

<script setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import CompareBar from './components/CompareBar.vue'
</script>
