<template>
  <div class="container py-5">
    <h1 class="fw-bold mb-4">Dịch vụ hậu mãi</h1>
    <div class="row g-4">
      <div class="col-md-4" v-for="s in services" :key="s.title">
        <div class="cs-card p-4 h-100">
          <h4>{{ s.icon }} {{ s.title }}</h4>
          <p class="cs-muted">{{ s.desc }}</p>
        </div>
      </div>
    </div>
    <div class="text-center mt-5">
      <router-link class="ford-btn-primary" to="/support">Đặt lịch dịch vụ</router-link>
    </div>
  </div>
</template>

<script setup>
const services = [
  { icon: '🔧', title: 'Bảo dưỡng định kỳ', desc: 'Kiểm tra và bảo dưỡng xe theo tiêu chuẩn hãng.' },
  { icon: '🛞', title: 'Thay lốp & phụ tùng', desc: 'Lốp xe, dầu nhớt và phụ tùng chính hãng.' },
  { icon: '📋', title: 'Kiểm tra tổng thể', desc: 'Kiểm tra an toàn toàn diện trước mỗi hành trình.' },
]
</script>
