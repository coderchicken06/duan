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
      <div v-if="promotion" class="promotion-badge">{{ promotion.name }} · {{ promotionLabel }}</div>
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
<script setup>
import { computed, onMounted, ref } from 'vue'
import { carImageUrl, formatPrice, promotionApi } from '../api'
import { useCompare } from '../composables/useCompare'
const props = defineProps({ car: { type: Object, required: true } })
defineEmits(['add-cart'])
const stock = computed(() => Number(props.car.stock || 0))
const promotion = ref(null)
const promotionLabel = computed(() => promotion.value?.type === 'PERCENT' ? `Giảm ${promotion.value.value}%` : `Giảm ${formatPrice(promotion.value?.value)} VNĐ`)
const { has, toggle, count } = useCompare()
function onCompare(event){ if (!has(props.car.id) && count.value >= 3){ event.target.checked=false; alert('Chỉ được so sánh tối đa 3 xe.'); return } toggle(props.car.id) }
onMounted(async()=>{try{const{data}=await promotionApi.getForCar(props.car.id);promotion.value=data.data?.[0]||null}catch{promotion.value=null}})
</script>
<style scoped>.compare-check{display:flex;align-items:center;gap:8px;margin:12px 0;font-weight:700;color:#333}.compare-check input{width:18px;height:18px;accent-color:#d71920}.promotion-badge{margin-top:8px;color:#b91c1c;font-size:.85rem;font-weight:800}</style>
