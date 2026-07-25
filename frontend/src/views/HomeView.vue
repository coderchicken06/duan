<template>
  <div class="page-home">
    <div v-if="alert" class="home-cart-alert show">{{ alert }}</div>

    <section class="ford-intro">
      <div class="ford-intro-grid">
        <div class="ford-intro-text text-center text-lg-start">
          <small class="ford-badge text-uppercase fw-bold">Trải nghiệm đỉnh cao</small>
          <h1 class="display-4 fw-bold">Khai Phá Mọi Hành Trình</h1>
          <p class="lead">Khám phá các dòng xe Ford mới nhất. Đặt cọc online, nhận xe tận nhà cùng nhiều ưu đãi hấp dẫn.</p>
          <div class="ford-intro-actions">
            <router-link class="ford-btn-primary" to="/car/list">Xem tất cả xe</router-link>
            <router-link class="ford-btn-outline" to="/cart/view">Giỏ hàng của bạn</router-link>
          </div>
        </div>
        <div class="ford-intro-image">
          <video autoplay muted loop playsinline class="ford-video-hero">
            <source :src="videoSrc" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>

    <div class="ford-section container">
      <div class="ford-section-head d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 class="fw-bold">Sản phẩm nổi bật</h2>
          <div v-if="q" class="ford-section-meta">
            Tìm kiếm: “<span class="text-primary fw-bold">{{ q }}</span>” ·
            <router-link to="/" class="text-decoration-none">Xóa bộ lọc</router-link>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="car in cars" :key="car.id" class="col-12 col-md-6 col-lg-4">
          <CarCard :car="car" @add-cart="addToCart" />
        </div>
      </div>
      <p v-if="!loading && cars.length === 0" class="text-center text-muted py-5">Không tìm thấy xe nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, cartApi } from '../api'
import CarCard from '../components/CarCard.vue'

const route = useRoute()
const cars = ref([])
const loading = ref(true)
const alert = ref('')
const q = ref(route.query.q || '')
const videoSrc = '/videos/ford-intro.mp4'

onMounted(loadCars)

async function loadCars() {
  loading.value = true
  try {
    const { data } = await carApi.getAll(q.value || undefined)
    cars.value = Array.isArray(data) ? data : data.data || []
  } finally {
    loading.value = false
  }
}

async function addToCart(id) {
  const { data } = await cartApi.add(id)
  if (data.success) {
    alert.value = 'Thêm giỏ hàng thành công'
    setTimeout(() => (alert.value = ''), 2500)
  } else {
    alert.value = data.message || 'Không thể thêm vào giỏ'
  }
}
</script>
