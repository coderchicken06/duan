<template>
  <div class="page-home">
    <div v-if="alert" class="home-cart-alert show">{{ alert }}</div>

    <section class="ford-hero-panel">
      <div class="ford-hero-panel-content">
        <span class="ford-badge">Xe mới • Giá tốt • Bảo hành dài hạn</span>
        <h1>Khám phá phương tiện hoàn hảo cho mọi hành trình</h1>
        <p>Khám phá các mẫu xe mới, đặt lịch xem xe trực tuyến và sở hữu chiếc xe phù hợp nhất với phong cách của bạn.</p>
        <div class="ford-intro-actions">
          <router-link class="ford-btn-primary" to="/car/list">Xem tất cả xe</router-link>
          <router-link class="ford-btn-outline" to="/cart/view">Giỏ hàng của bạn</router-link>
        </div>
      </div>
      <div class="ford-hero-side">
        <div class="ford-hero-stat">
          <strong>120+</strong>
          <span>mẫu xe đang chờ bạn</span>
        </div>
        <div class="ford-hero-stat">
          <strong>4.9/5</strong>
          <span>đánh giá khách hàng</span>
        </div>
        <div class="ford-hero-stat">
          <strong>24/7</strong>
          <span>hỗ trợ đặt lịch</span>
        </div>
      </div>
    </section>

    <div class="ford-section container">
      <div class="ford-section-head">
        <div>
          <h2>Sản phẩm nổi bật</h2>
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
      <p v-if="!loading && cars.length === 0" class="ford-empty-state">Không tìm thấy xe nào.</p>
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
