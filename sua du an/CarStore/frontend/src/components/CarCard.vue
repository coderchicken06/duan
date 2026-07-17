<template>
  <article class="ford-car-card h-100">
    <div class="ford-car-img">
      <img :src="carImageUrl(car.image)" :alt="car.name" />
      <span class="ford-car-chip">Mới</span>
    </div>
    <div class="ford-car-body">
      <div class="ford-car-meta">
        <span class="ford-car-badge">Mã hãng: {{ car.brandId }}</span>
        <span class="ford-car-year">2026</span>
      </div>
      <h3>{{ car.name }}</h3>
      <p class="ford-car-description">Thiết kế hiện đại, vận hành êm và phù hợp cho cả thành phố lẫn hành trình dài.</p>
      <div class="ford-price-tag">
        {{ formatPrice(car.price) }} <small>VNĐ</small>
      </div>
      <div class="ford-car-actions">
        <router-link class="ford-btn-primary text-center" :to="`/car/detail/${car.id}`">Chi tiết</router-link>
        <button type="button" class="ford-btn-outline" @click="$emit('add-cart', car.id)">Thêm giỏ</button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { carImageUrl, formatPrice } from '../api'

defineProps({ car: { type: Object, required: true } })
defineEmits(['add-cart'])
</script>
