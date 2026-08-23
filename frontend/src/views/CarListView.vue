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
              <option value="demo">Đến 5 triệu</option>
              <option value="5m-500m">Trên 5 triệu đến dưới 500 triệu</option>
              <option value="500m-1b">Từ 500 triệu đến dưới 1 tỷ</option>
              <option value="1b-2b">Từ 1 đến 2 tỷ</option>
              <option value="2b-plus">Trên 2 tỷ</option>
            </select>
          </label>

          <label>
            <span>Năm</span>
            <select v-model="filters.year">
              <option value="">Tất cả</option>
              <option v-for="year in availableYears" :key="year" :value="String(year)">{{ year }}</option>
            </select>
          </label>

          <label>
            <span>Màu sắc</span>
            <input v-model="filters.color" type="text" placeholder="Ví dụ: Đen, Trắng" />
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
import { brandApi, carApi, cartApi } from '../api'
import CarCard from '../components/CarCard.vue'
import { showCartToast } from '../composables/useCartToast'
import { useAutoRefresh } from '../composables/useAutoRefresh'
import { useCartStore } from '../stores/cart'

const route = useRoute()
const cart = useCartStore()
const allCars = ref([])
const brands = ref([])
const loading = ref(true)
const message = ref('')
const loadError = ref('')
const q = ref(route.query.q || '')
const filters = ref({
  brandId: '',
  priceRange: '',
  year: '',
  color: '',
  fuelType: '',
  seats: '',
})

const availableYears = computed(() => {
  const years = allCars.value
    .map((car) => car.year)
    .filter((year) => year != null)
  return Array.from(new Set(years)).sort((a, b) => b - a)
})
const availableFuelTypes = computed(() => [...new Set(allCars.value.map((car) => car.fuelType).filter(Boolean))])
const availableSeats = computed(() => [...new Set(allCars.value.map((car) => car.seats).filter((seat) => seat != null))].sort((a, b) => a - b))

const filteredCars = computed(() => {
  const query = String(q.value || '').trim().toLowerCase()
  return allCars.value.filter((car) => {
    const name = (car.name || '').toLowerCase()
    const description = (car.description || '').toLowerCase()
    const color = (car.color || '').toLowerCase()
    const price = Number(car.price || 0)

    const matchesQuery = !query || name.includes(query) || description.includes(query)
    const matchesBrand = !filters.value.brandId || String(car.brandId) === filters.value.brandId
    const matchesPrice = (() => {
      if (!filters.value.priceRange) return true
      if (filters.value.priceRange === 'demo') return price <= 5000000
      if (filters.value.priceRange === '5m-500m') return price > 5000000 && price < 500000000
      if (filters.value.priceRange === '500m-1b') return price >= 500000000 && price < 1000000000
      if (filters.value.priceRange === '1b-2b') return price >= 1000000000 && price <= 2000000000
      if (filters.value.priceRange === '2b-plus') return price > 2000000000
      return true
    })()
    const matchesStatus = String(car.status || '').toUpperCase() === 'AVAILABLE'
    const matchesYear = !filters.value.year || String(car.year) === filters.value.year
    const matchesColor = !filters.value.color || color.includes(filters.value.color.trim().toLowerCase())

    const matchesFuel = !filters.value.fuelType || car.fuelType === filters.value.fuelType
    const matchesSeats = !filters.value.seats || String(car.seats) === filters.value.seats
    return matchesQuery && matchesBrand && matchesPrice && matchesStatus && matchesYear && matchesColor && matchesFuel && matchesSeats
  })
})

watch(() => route.fullPath, () => {
  q.value = String(route.query.q || '')
  loadCars(true)
})

onMounted(loadCars)
useAutoRefresh(() => loadCars(true))

async function loadCars(silent = false) {
  if (!silent) {
    loading.value = true
    loadError.value = ''
  }
  try {
    const [carsResponse, brandsResponse] = await Promise.all([
      carApi.getAll(String(q.value || '') || undefined),
      brandApi.getAll(),
    ])
    const carData = carsResponse.data
    const brandData = brandsResponse.data
    allCars.value = Array.isArray(carData) ? carData : carData.data || []
    brands.value = Array.isArray(brandData) ? brandData : brandData.data || []
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
    year: '',
    color: '',
    fuelType: '',
    seats: '',
  }
}

async function addToCart(id) {
  const car = allCars.value.find((item) => item.id === id)
  if (!car || Number(car.stock || 0) <= 0) {
    message.value = 'Xe đã hết hàng, không thể thêm vào giỏ'
    return
  }
  try {
    const { data } = await cartApi.add(id)
    if (data.success) {
      await cart.refresh()
      showCartToast('Thêm vào giỏ hàng thành công!')
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
