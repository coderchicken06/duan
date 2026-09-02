<template>
  <div class="page-home">
    <div v-if="alert" class="home-cart-alert show error">{{ alert }}</div>

    <section class="ford-hero-panel">
      <div class="ford-hero-panel-content">
        <span class="ford-badge">Xe mới • Giá tốt • Bảo hành dài hạn</span>
        <h1>Khám phá phương tiện hoàn hảo cho mọi hành trình</h1>
        <p>Khám phá các mẫu xe mới, đặt lịch xem xe trực tuyến và sở hữu chiếc xe phù hợp nhất với phong cách của bạn.
        </p>
        <div class="ford-intro-actions">
          <router-link class="ford-btn-primary" to="/car/list">Xem tất cả xe</router-link>
          <router-link class="ford-btn-outline" to="/cart/view">Phiếu đặt cọc xe của bạn</router-link>
        </div>
      </div>
      <div class="ford-hero-side">
        <div class="ford-hero-stat"><strong>{{ cars.length }}</strong><span>mẫu xe đang chờ bạn</span></div>
        <div class="ford-hero-stat"><strong>4.9/5</strong><span>đánh giá khách hàng</span></div>
        <div class="ford-hero-stat"><strong>24/7</strong><span>hỗ trợ đặt lịch</span></div>
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
      <div v-if="loadError" class="ford-api-error" role="alert">
        {{ loadError }}
        <button type="button" @click="loadCars">Thử lại</button>
      </div>
      <p v-if="!loading && !loadError && cars.length === 0" class="ford-empty-state">Không tìm thấy xe nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { cartApi, promotionApi } from '../api'
import CarCard from '../components/CarCard.vue'
import { showCartToast } from '../composables/useCartToast'
import { notifyDataUpdated, useAutoRefresh } from '../composables/useAutoRefresh'
import { useCartStore } from '../stores/cart'
import { useCatalogStore } from '../stores/catalog'

const route = useRoute()
const cart = useCartStore()
const catalog = useCatalogStore()
const cars = ref([])
const loading = ref(true)
const loadError = ref('')
const alert = ref('')
const q = ref(route.query.q || '')

onMounted(loadCars)
useAutoRefresh(() => {
  console.log('[HOME] Đang tự động làm mới dữ liệu từ Broadcast...')
  return loadCars(true, true)
})

watch(() => route.fullPath, () => {
  q.value = String(route.query.q || '')
  loadCars(true)
})

async function loadCars(silent = false, force = false) {
  if (!silent) {
    loading.value = true
    loadError.value = ''
  }
  try {
    const result = await catalog.loadCars(force)
    const keyword = String(q.value || '').trim().toLowerCase()
    const availableCars = result.filter((car) => {
      const name = String(car.name || '').toLowerCase()
      const brandName = String(car.brandName || '').toLowerCase()
      return String(car.status || '').toUpperCase() === 'AVAILABLE'
        && (!keyword || name.includes(keyword) || brandName.includes(keyword))
    })
    cars.value = await Promise.all(availableCars.map(withActivePromotion))
  } catch (error) {
    if (!silent) {
      cars.value = []
      loadError.value = error.response?.data?.message
        || 'Không thể kết nối cơ sở dữ liệu sản phẩm. Vui lòng kiểm tra backend rồi thử lại.'
    }
  } finally {
    if (!silent) loading.value = false
  }
}

async function withActivePromotion(car) {
  try {
    const { data } = await promotionApi.getForCar(car.id)
    const promotion = data.data?.[0] || null
    if (!promotion) return { ...car, promotion: null }

    const price = Number(car.price || 0)
    const discountAmount = promotion.type === 'PERCENT'
      ? price * Number(promotion.value || 0) / 100
      : Number(promotion.value || 0)
    const safeDiscount = Math.max(0, Math.min(price, discountAmount))
    return {
      ...car,
      promotion,
      promotionTitle: promotion.name,
      discountPercent: promotion.type === 'PERCENT' ? Number(promotion.value || 0) : null,
      discountAmount: safeDiscount,
      discountedPrice: Math.max(0, price - safeDiscount),
    }
  } catch {
    return { ...car, promotion: null }
  }
}

async function addToCart(id) {
  const { data } = await cartApi.add(id)
  if (data.success) {
    await cart.refresh()
    notifyDataUpdated()
    showCartToast('Thêm vào phiếu đặt cọc xe thành công!')
    alert.value = ''
  } else {
    alert.value = data.message || 'Không thể thêm vào phiếu đặt cọc xe'
  }
}
</script>
<style
  scoped>
  .page-home > .ford-hero-panel {
    margin-top: 24px;
    margin-bottom: 8px;
  }

  .ford-api-error {
    margin: 24px 0;
    padding: 14px 16px;
    border: 1px solid #fecaca;
    border-radius: 12px;
    background: #fef2f2;
    color: #991b1b;
    text-align: center
  }

  .ford-api-error button {
    margin-left: 12px;
    border: 0;
    border-radius: 999px;
    padding: 7px 14px;
    background: #991b1b;
    color: #fff;
    font-weight: 700
  }

  @media (max-width: 768px) {
    .page-home > .ford-hero-panel {
      margin-top: 20px;
      margin-bottom: 8px;
    }
  }
</style>
