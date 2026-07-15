<template>
  <article class="ford-car-card h-100 shadow-sm">
    <div class="ford-car-img">
      <img :src="carImageUrl(car.image)" :alt="car.name" />
    </div>
    <div class="ford-car-body p-4">
      <small class="text-muted text-uppercase">Mã hãng: {{ car.brandId }}</small>
      <h3 class="h5 fw-bold my-2">{{ car.name }}</h3>
      <div class="ford-price-tag mb-3 fs-5 text-danger fw-bold">
        {{ formatPrice(car.price) }} <small>VNĐ</small>
      </div>
      <div class="d-flex gap-2 mt-3">
        <router-link class="ford-btn-primary w-100 text-center" :to="`/car/detail/${car.id}`">Chi tiết</router-link>
        <button type="button" class="ford-btn-outline w-100" @click="$emit('add-cart', car.id)">Thêm giỏ hàng</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { carImageUrl, formatPrice } from '../api'

defineProps({ car: { type: Object, required: true } })
defineEmits(['add-cart'])
</script>
