<template>
  <div class="container py-4" v-if="car">
    <div class="row g-4">
      <div class="col-md-6">
        <img :src="carImageUrl(car.image)" :alt="car.name" class="img-fluid rounded shadow" />
      </div>
      <div class="col-md-6">
        <h1 class="fw-bold">{{ car.name }}</h1>
        <p class="fs-4 text-danger fw-bold">{{ formatPrice(car.price) }} VNĐ</p>
        <p><strong>Năm:</strong> {{ car.year }} | <strong>Màu:</strong> {{ car.color }} | <strong>Tồn kho:</strong> {{ car.stock }}</p>
        <p class="text-muted">{{ car.description }}</p>
        <div class="d-flex gap-2 mt-4">
          <button class="ford-btn-primary" @click="addToCart">Thêm vào giỏ hàng</button>
          <router-link class="ford-btn-outline" to="/car/list">Quay lại</router-link>
        </div>
        <div v-if="message" class="alert mt-3" :class="success ? 'alert-success' : 'alert-danger'">{{ message }}</div>
      </div>
    </div>
  </div>
  <p v-else class="text-center py-5">Đang tải...</p>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, cartApi, carImageUrl, formatPrice } from '../api'

const route = useRoute()
const car = ref(null)
const message = ref('')
const success = ref(false)

onMounted(async () => {
  const { data } = await carApi.getById(route.params.id)
  car.value = data.data || data
})

async function addToCart() {
  const { data } = await cartApi.add(car.value.id)
  success.value = data.success
  message.value = data.success ? 'Đã thêm vào giỏ hàng' : (data.message || 'Lỗi')
}
</script>
