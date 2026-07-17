<template>
  <div class="car-list-shell">
    <section class="ford-hero-panel compact">
      <div class="ford-hero-panel-content">
        <span class="ford-badge">Bộ sưu tập xe</span>
        <h1>Danh sách xe chất lượng cao</h1>
        <p>Khám phá các mẫu xe mới, so sánh thông số và chọn chiếc xe phù hợp nhất cho nhu cầu của bạn.</p>
      </div>
      <div class="ford-hero-side">
        <div class="ford-hero-stat">
          <strong>{{ filteredCars.length }}</strong>
          <span>mẫu xe phù hợp</span>
        </div>
        <div v-if="q" class="ford-hero-pill">Tìm kiếm: “{{ q }}”</div>
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

      <div class="ford-filter-card">
        <div class="ford-filter-card-header">Bộ lọc sản phẩm</div>
        <div class="ford-filter-grid">
          <label>
            <span>Thương hiệu</span>
            <select v-model="filters.brandId">
              <option value="">Tất cả</option>
              <option value="1">Toyota</option>
              <option value="2">BMW</option>
              <option value="3">Mercedes</option>
              <option value="4">Honda</option>
            </select>
          </label>

          <label>
            <span>Mức giá</span>
            <select v-model="filters.priceRange">
              <option value="">Tất cả</option>
              <option value="under-1b">Dưới 1 tỷ</option>
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
        </div>

        <div class="ford-filter-actions">
          <button type="button" class="ford-btn-outline" @click="resetFilters">Xóa bộ lọc</button>
          <span class="ford-filter-result">Hiển thị {{ filteredCars.length }} xe</span>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="car in filteredCars" :key="car.id" class="col-12 col-md-6 col-lg-4">
          <CarCard :car="car" @add-cart="addToCart" />
        </div>
      </div>
      <p v-if="!loading && filteredCars.length === 0" class="ford-empty-state">Không có xe nào phù hợp với bộ lọc.</p>
      <div v-if="message" class="alert alert-success mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, cartApi } from '../api'
import CarCard from '../components/CarCard.vue'

const route = useRoute()
const allCars = ref([])
const loading = ref(true)
const message = ref('')
const q = ref(route.query.q || '')
const filters = ref({
  brandId: '',
  priceRange: '',
  year: '',
  color: '',
})

const availableYears = computed(() => {
  const years = allCars.value
    .map((car) => car.year)
    .filter((year) => year != null)
  return Array.from(new Set(years)).sort((a, b) => b - a)
})

const filteredCars = computed(() => {
  const query = (q.value || '').trim().toLowerCase()
  return allCars.value.filter((car) => {
    const name = (car.name || '').toLowerCase()
    const description = (car.description || '').toLowerCase()
    const color = (car.color || '').toLowerCase()
    const price = Number(car.price || 0)

    const matchesQuery = !query || name.includes(query) || description.includes(query)
    const matchesBrand = !filters.value.brandId || String(car.brandId) === filters.value.brandId
    const matchesPrice = (() => {
      if (!filters.value.priceRange) return true
      if (filters.value.priceRange === 'under-1b') return price < 1000000000
      if (filters.value.priceRange === '1b-2b') return price >= 1000000000 && price <= 2000000000
      if (filters.value.priceRange === '2b-plus') return price > 2000000000
      return true
    })()
    const matchesYear = !filters.value.year || String(car.year) === filters.value.year
    const matchesColor = !filters.value.color || color.includes(filters.value.color.trim().toLowerCase())

    return matchesQuery && matchesBrand && matchesPrice && matchesYear && matchesColor
  })
})

watch(() => route.query.q, (val) => {
  q.value = val || ''
  loadCars()
})

onMounted(loadCars)

async function loadCars() {
  loading.value = true
  try {
    const { data } = await carApi.getAll(q.value || undefined)
    allCars.value = Array.isArray(data) ? data : data.data || []
  } finally {
    loading.value = false
  }
}

function resetFilters() {
  filters.value = {
    brandId: '',
    priceRange: '',
    year: '',
    color: '',
  }
}

async function addToCart(id) {
  const { data } = await cartApi.add(id)
  message.value = data.success ? 'Đã thêm vào giỏ hàng' : (data.message || 'Lỗi')
}
</script>
