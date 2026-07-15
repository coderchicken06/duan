<template>
  <footer class="ford-footer mt-auto">
    <div class="container py-4 text-center">
      <p class="mb-1 fw-bold">CarStore — Đại lý xe Ford chính hãng</p>
      <p class="text-muted small mb-0">© {{ year }} CarStore. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.ford-footer {
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 3rem;
}
</style>
