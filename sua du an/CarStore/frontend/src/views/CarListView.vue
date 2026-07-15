<template>
  <div class="ford-section container py-4">
    <h1 class="fw-bold mb-4">Danh sách xe</h1>
    <div v-if="q" class="mb-3">
      Kết quả tìm kiếm: “<strong>{{ q }}</strong>”
      <router-link to="/car/list" class="ms-2">Xóa bộ lọc</router-link>
    </div>
    <div class="row g-4">
      <div v-for="car in cars" :key="car.id" class="col-12 col-md-6 col-lg-4">
        <CarCard :car="car" @add-cart="addToCart" />
      </div>
    </div>
    <p v-if="!loading && cars.length === 0" class="text-center text-muted py-5">Không có xe nào.</p>
    <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, cartApi } from '../api'
import CarCard from '../components/CarCard.vue'

const route = useRoute()
const cars = ref([])
const loading = ref(true)
const message = ref('')
const q = ref(route.query.q || '')

watch(() => route.query.q, (val) => { q.value = val || ''; loadCars() })

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
  message.value = data.success ? 'Đã thêm vào giỏ hàng' : (data.message || 'Lỗi')
}
</script>
