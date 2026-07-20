<template>
  <article class="ford-car-card h-100">
    <div class="ford-car-img">
      <img :src="carImageUrl(car.image)" :alt="car.name" />
      <span v-if="car.inspectionLevel" class="ford-car-chip">{{ car.inspectionLevel }}</span>
    </div>
    <div class="ford-car-body">
      <div class="ford-car-meta"><span class="ford-car-badge">{{ car.bodyType || 'Ô tô' }}</span><span class="ford-car-year">{{ car.year || '—' }}</span></div>
      <h3>{{ car.name }}</h3>
      <p class="ford-car-description">{{ car.mileage != null ? Number(car.mileage).toLocaleString('vi-VN') + ' km' : 'ODO chưa cập nhật' }} · {{ car.transmission || 'Hộp số chưa cập nhật' }}</p>
      <div class="ford-price-tag">{{ formatPrice(car.price) }} <small>VNĐ</small></div>
      <label class="compare-check"><input type="checkbox" :checked="has(car.id)" @change="onCompare" /> So sánh xe</label>
      <div class="ford-car-actions">
        <router-link class="ford-btn-primary text-center" :to="`/car/detail/${car.id}`">Chi tiết</router-link>
        <button type="button" class="ford-btn-outline" :disabled="stock <= 0" @click="$emit('add-cart', car.id)">
          {{ stock > 0 ? 'Thêm giỏ' : 'Hết hàng' }}
        </button>
      </div>
    </div>
  </article>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { carImageUrl, formatPrice } from '../api'
import { useCompare } from '../composables/useCompare'
const props = defineProps({ car: { type: Object, required: true } })
defineEmits(['add-cart'])
const stock = computed(() => Number(props.car.stock || 0))
const { has, toggle, count } = useCompare()
function onCompare(event){ if (!has(props.car.id) && count.value >= 3){ event.target.checked=false; alert('Chỉ được so sánh tối đa 3 xe.'); return } toggle(props.car.id) }
</script>
<style scoped>.compare-check{display:flex;align-items:center;gap:8px;margin:12px 0;font-weight:700;color:#333}.compare-check input{width:18px;height:18px;accent-color:#d71920}</style>
