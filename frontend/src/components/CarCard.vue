<template>
  <article class="ford-car-card h-100">
    <div class="ford-car-img">
      <img :src="carImageUrl(car.image)" :alt="car.name" loading="lazy" decoding="async"
        @error="useDefaultCarImage" />
      <span v-if="car.inspectionLevel" class="ford-car-chip">{{ car.inspectionLevel }}</span>
    </div>
    <div class="ford-car-body">
      <div class="ford-car-meta"><span class="ford-car-badge">{{ car.bodyType || 'Ô tô' }}</span><span
          class="ford-car-year">{{ car.year || '—' }}</span></div>
      <h3>{{ car.name }}</h3>
      <p class="ford-car-description">{{ car.mileage != null ? Number(car.mileage).toLocaleString('vi-VN') + ' km' :
        'ODO chưa cập nhật' }} · {{ car.transmission || 'Hộp số chưa cập nhật' }}</p>
      <div class="car-price-block" :class="{ 'has-promotion': promotion }">
        <span v-if="promotion" class="original-price">{{ formatPrice(car.price) }} VNĐ</span>
        <span v-else class="price-slot" aria-hidden="true"></span>

        <strong class="current-price">{{ formatPrice(promotion ? discountedPrice : car.price) }} <small>VNĐ</small></strong>

        <span v-if="promotion" class="promotion-badge" :title="`${promotionTitle} - ${promotionLabel}`">
          {{ promotionTitle }} - {{ promotionLabel }}
        </span>
        <span v-else class="price-slot promotion-slot" aria-hidden="true"></span>
      </div>
      <label class="compare-check"><input type="checkbox" :checked="has(car.id)" @change="onCompare" /> So sánh
        xe</label>
      <div class="ford-car-actions">
        <router-link class="ford-btn-primary text-center" :to="`/car/detail/${car.id}`">Chi tiết</router-link>
        <button v-if="!auth.isAdmin" type="button" class="ford-btn-outline" :disabled="stock <= 0" @click="$emit('add-cart', car.id)">
          {{ stock > 0 ? 'Đặt cọc ngay' : 'Hết hàng' }}
        </button>
      </div>
    </div>
  </article>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import { carImageUrl, formatPrice, promotionApi, useDefaultCarImage } from '../api'
import { useCompare } from '../composables/useCompare'
import { showCartToast } from '../composables/useCartToast'
import { useAuthStore } from '../stores/auth'
const props = defineProps({ car: { type: Object, required: true } })
defineEmits(['add-cart'])
const stock = computed(() => Number(props.car.stock || 0))
const auth = useAuthStore()
const loadedPromotion = ref(null)
const hasPromotionData = computed(() => Object.prototype.hasOwnProperty.call(props.car, 'promotion'))
const promotion = computed(() => hasPromotionData.value ? props.car.promotion : loadedPromotion.value)
const promotionTitle = computed(() => promotion.value?.name || props.car.promotionTitle || 'Ưu đãi showroom')
const discountAmount = computed(() => {
  if (Number.isFinite(Number(props.car.discountAmount))) return Number(props.car.discountAmount)
  if (!promotion.value) return 0
  const price = Number(props.car.price || 0)
  const amount = promotion.value.type === 'PERCENT'
    ? price * Number(promotion.value.value || 0) / 100
    : Number(promotion.value.value || 0)
  return Math.max(0, Math.min(price, amount))
})
const discountedPrice = computed(() => Number.isFinite(Number(props.car.discountedPrice))
  ? Number(props.car.discountedPrice)
  : Math.max(0, Number(props.car.price || 0) - discountAmount.value))
const promotionLabel = computed(() => promotion.value?.type === 'PERCENT'
  ? `Giảm ${promotion.value.value}%`
  : `Giảm ${formatPrice(discountAmount.value)} VNĐ`)
const { has, toggle, count } = useCompare()
function onCompare(event) { if (!has(props.car.id) && count.value >= 3) { event.target.checked = false; showCartToast('Chỉ được so sánh tối đa 3 xe.', 'warning'); return } toggle(props.car.id) }
watch(() => props.car, async () => {
  if (hasPromotionData.value) {
    loadedPromotion.value = null
    return
  }
  try {
    const { data } = await promotionApi.getForCar(props.car.id)
    loadedPromotion.value = data.data?.[0] || null
  } catch {
    loadedPromotion.value = null
  }
}, { immediate: true })
</script>
<style
  scoped>
  .compare-check {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 12px 0;
    font-weight: 700;
    color: #333
  }

  .compare-check input {
    width: 18px;
    height: 18px;
    accent-color: #d71920
  }

  .car-price-block {
    display: grid;
    grid-template-rows: 18px 28px 28px;
    min-height: 74px;
  }

  .price-slot {
    display: block;
  }

  .promotion-slot {
    margin-top: 4px;
  }

  .promotion-badge {
    align-self: start;
    background: #fee2e2;
    border-radius: 4px;
    color: #b91c1c;
    display: block;
    font-size: .6875rem;
    font-weight: 800;
    line-height: 1.25;
    margin-top: 4px;
    max-width: 100%;
    overflow: hidden;
    padding: 2px 7px;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: fit-content
  }

  .current-price {
    align-self: start;
    color: #dc2626;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .original-price {
    color: #94a3b8;
    font-size: .875rem;
    line-height: 18px;
    text-decoration: line-through;
  }

</style>
