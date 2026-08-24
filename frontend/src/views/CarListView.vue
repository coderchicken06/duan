<template>
  <div class="car-list-shell">
    <section class="ford-hero-panel compact car-list-hero">
      <div class="ford-hero-panel-content">
        <span class="ford-badge">Bộ sưu tập xe</span>
        <h1>Danh sách xe chất lượng cao</h1>
        <p>Khám phá các mẫu xe mới, so sánh thông số và chọn chiếc xe phù hợp nhất cho nhu cầu của bạn.</p>
      </div>
    </section>

    <div class="ford-section container py-4">
      <div class="ford-section-head">
        <div>
          <h2>Danh sách xe</h2>
          <div v-if="q" class="ford-section-meta">
            Kết quả tìm kiếm: “<strong>{{ q }}</strong>”
            <router-link to="/car/list" class="ms-2">Xóa bộ lọc</router-link>
          </div>
        </div>
      </div>

      <div v-if="loadError" class="alert alert-danger" role="alert">{{ loadError }}</div>

      <div class="ford-filter-card">
        <div class="ford-filter-card-header">Bộ lọc sản phẩm</div>
        <div class="ford-filter-grid">
          <label>
            <span>Thương hiệu</span>
            <select v-model="filters.brandId">
              <option value="">Tất cả</option>
              <option v-for="brand in brands" :key="brand.id" :value="String(brand.id)">
                {{ brand.name }}
              </option>
            </select>
          </label>

          <label>
            <span>Mức giá</span>
            <select v-model="filters.priceRange">
              <option value="">Tất cả</option>
              <option value="under-1b">Dưới 1 tỷ</option>
              <option value="1b-2b">Từ 1 đến 2 tỷ</option>
              <option value="over-2b">Trên 2 tỷ</option>
            </select>
          </label>

          <label>
            <span>Nhiên liệu</span>
            <select v-model="filters.fuelType">
              <option value="">Tất cả</option>
              <option v-for="fuel in availableFuelTypes" :key="fuel" :value="fuel">{{ fuel }}</option>
            </select>
          </label>
          <label>
            <span>Số chỗ</span>
            <select v-model="filters.seats">
              <option value="">Tất cả</option>
              <option v-for="seat in availableSeats" :key="seat" :value="String(seat)">{{ seat }} chỗ</option>
            </select>
          </label>
        </div>

        <div class="ford-filter-actions">
          <button type="button" class="ford-btn-outline" @click="resetFilters">Xóa bộ lọc</button>
          <span class="ford-filter-result">Hiển thị {{ filteredCars.length }} xe</span>
        </div>
      </div>

      <div v-if="loading" class="row g-4" aria-label="Đang tải danh sách xe">
        <div v-for="item in 6" :key="item" class="col-12 col-md-6 col-lg-4">
          <div class="car-skeleton"></div>
        </div>
      </div>
      <div v-else class="row g-4">
        <div v-for="car in filteredCars" :key="car.id" class="col-12 col-md-6 col-lg-4">
          <CarCard :car="car" @add-cart="addToCart" />
        </div>
      </div>
      <p v-if="!loading && filteredCars.length === 0" class="ford-empty-state">Không có xe nào phù hợp với bộ lọc.</p>
      <div v-if="message" class="alert alert-danger cart-alert show error">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { cartApi } from '../api'
import CarCard from '../components/CarCard.vue'
import { showCartToast } from '../composables/useCartToast'
import { useAutoRefresh } from '../composables/useAutoRefresh'
import { useCartStore } from '../stores/cart'
import { useCatalogStore } from '../stores/catalog'

const route = useRoute()
const cart = useCartStore()
const catalog = useCatalogStore()
const allCars = ref([])
const brands = ref([])
const loading = ref(true)
const message = ref('')
const loadError = ref('')
const q = ref(route.query.q || '')
const filters = ref({
  brandId: '',
  priceRange: '',
  fuelType: '',
  seats: '',
})

const availableFuelTypes = computed(() => [...new Set(allCars.value.map((car) => car.fuelType).filter(Boolean))])
const availableSeats = computed(() => [...new Set(allCars.value.map((car) => car.seats).filter((seat) => seat != null))].sort((a, b) => a - b))
const brandNames = computed(() => new Map(brands.value.map((brand) => [String(brand.id), String(brand.name || '')])))

const filteredCars = computed(() => {
  const query = String(q.value || '').trim().toLowerCase()
  return allCars.value.filter((car) => {
    const name = (car.name || '').toLowerCase()
    const description = (car.description || '').toLowerCase()
    const brandName = String(car.brandName || brandNames.value.get(String(car.brandId)) || '').toLowerCase()
    const price = Number(car.price || 0)

    const matchesQuery = !query || name.includes(query) || brandName.includes(query) || description.includes(query)
    const matchesBrand = !filters.value.brandId || String(car.brandId) === filters.value.brandId
    const matchesPrice = (() => {
      if (!filters.value.priceRange) return true
      if (filters.value.priceRange === 'under-1b') return price < 1000000000
      if (filters.value.priceRange === '1b-2b') return price >= 1000000000 && price <= 2000000000
      if (filters.value.priceRange === 'over-2b') return price > 2000000000
      return true
    })()
    const matchesStatus = String(car.status || '').toUpperCase() === 'AVAILABLE'

    const matchesFuel = !filters.value.fuelType || car.fuelType === filters.value.fuelType
    const matchesSeats = !filters.value.seats || String(car.seats) === filters.value.seats
    return matchesQuery && matchesBrand && matchesPrice && matchesStatus && matchesFuel && matchesSeats
  })
})

watch(() => route.fullPath, () => {
  q.value = String(route.query.q || '')
})

onMounted(loadCars)
useAutoRefresh(() => loadCars(true, true), 0)

async function loadCars(silent = false, force = false) {
  if (!silent) {
    loading.value = true
    loadError.value = ''
  }
  try {
    const [carData, brandData] = await Promise.all([
      catalog.loadCars(force),
      catalog.loadBrands(force),
    ])
    allCars.value = carData
    brands.value = brandData
  } catch {
    if (!silent) {
      allCars.value = []
      brands.value = []
      loadError.value = 'Không thể kết nối máy chủ. Vui lòng kiểm tra backend và thử lại.'
    }
  } finally {
    if (!silent) loading.value = false
  }
}

function resetFilters() {
  filters.value = {
    brandId: '',
    priceRange: '',
    fuelType: '',
    seats: '',
  }
}

async function addToCart(id) {
  const car = allCars.value.find((item) => item.id === id)
  if (!car || Number(car.stock || 0) <= 0) {
    message.value = 'Xe đã hết hàng, không thể thêm vào phiếu đặt cọc xe'
    return
  }
  try {
    const { data } = await cartApi.add(id)
    if (data.success) {
      await cart.refresh()
      showCartToast('Thêm vào phiếu đặt cọc xe thành công!')
      message.value = ''
    } else {
      message.value = data.message || 'Lỗi'
    }
  } catch {
    message.value = 'Không thể kết nối máy chủ để thêm xe vào giỏ'
  }
}
</script>

<style scoped>
.car-list-hero {
  grid-template-columns: minmax(0, 1fr);
}

.car-list-hero .ford-hero-panel-content {
  max-width: 760px;
}

.ford-filter-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 768px) {
  .ford-filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.car-skeleton {
  animation: pulse 1.2s ease-in-out infinite;
  background: #e5e7eb;
  border-radius: 8px;
  height: 360px;
}

@keyframes pulse {
  50% {
    opacity: .55;
  }
}
</style>
