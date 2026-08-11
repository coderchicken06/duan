<template>
  <div class="container cs-container py-5">
    <div class="page-heading">
      <div>
        <span class="admin-eyebrow">THEO DÕI KHO XE</span>
        <h2 class="cs-page-title mb-0">Quản lý tồn kho</h2>
        <p class="page-description mb-0">Theo dõi số lượng và trạng thái xe; dữ liệu kho được cập nhật từ luồng đơn
          hàng.</p>
      </div>
      <button class="btn cs-btn cs-btn-ghost" type="button" :disabled="loading" @click="load">
        {{ loading ? 'Đang tải...' : 'Làm mới dữ liệu' }}
      </button>
    </div>

    <div class="summary-grid">
      <article><span>Mẫu xe</span><strong>{{ cars.length }}</strong></article>
      <article><span>Tổng tồn kho</span><strong>{{ totalStock }}</strong></article>
      <article><span>Sắp hết hàng</span><strong>{{ lowStockCount }}</strong></article>
      <article><span>Hết hàng</span><strong>{{ outOfStockCount }}</strong></article>
    </div>

    <div class="table-responsive cs-card p-3">
      <table class="table cs-table align-middle mb-0">
        <thead>
          <tr>
            <th>Xe</th>
            <th>Thương hiệu</th>
            <th>Số khung/Biển số</th>
            <th>Tồn kho</th>
            <th>Trạng thái kinh doanh</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="empty-cell">Đang tải dữ liệu tồn kho...</td>
          </tr>
          <tr v-for="car in cars" v-else :key="car.id">
            <td>
              <div class="car-cell">
                <img :src="carImageUrl(car.image)" :alt="car.name" @error="useDefaultCarImage" />
                <div><strong>{{ car.name }}</strong><small>ID: {{ car.id }}</small></div>
              </div>
            </td>
            <td>{{ brandName(car.brandId) }}</td>
            <td class="identity-cell">{{ vehicleIdentity(car) }}</td>
            <td><span class="stock-badge" :class="stockClass(car.stock)">{{ car.stock }}</span></td>
            <td><span class="status-badge" :class="statusClass(car.status)">{{ statusLabel(car.status) }}</span></td>
          </tr>
          <tr v-if="!loading && cars.length === 0">
            <td colspan="5" class="empty-cell">Chưa có xe trong kho.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { adminApi, carImageUrl, useDefaultCarImage } from '../../api'
import { showCartToast } from '../../composables/useCartToast'

const cars = ref([])
const brands = ref([])
const loading = ref(false)
let pollTimer = null
const brandMap = computed(() => new Map(brands.value.map((brand) => [Number(brand.id), brand.name])))
const totalStock = computed(() => cars.value.reduce((total, car) => total + Number(car.stock || 0), 0))
const lowStockCount = computed(() => cars.value.filter((car) => Number(car.stock) > 0 && Number(car.stock) <= 3).length)
const outOfStockCount = computed(() => cars.value.filter((car) => Number(car.stock || 0) === 0).length)

onMounted(() => {
  load()
  pollTimer = window.setInterval(() => load(true), 2000)
})

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})

async function load(silent = false) {
  if (!silent) {
    loading.value = true
  }

  try {
    const [carResponse, brandResponse] = await Promise.all([
      adminApi.getCars(),
      adminApi.getBrands()
    ])

    cars.value = Array.isArray(carResponse.data)
      ? carResponse.data
      : carResponse.data.data || []

    brands.value = Array.isArray(brandResponse.data)
      ? brandResponse.data
      : brandResponse.data.data || []
  } catch (error) {
    if (!silent) {
      showCartToast(
        error.response?.data?.message || 'Không thể tải dữ liệu tồn kho',
        'error'
      )
    }
  } finally {
    if (!silent) {
      loading.value = false
    }
  }
}

const brandName = (brandId) => brandMap.value.get(Number(brandId)) || 'Chưa xác định'
const vehicleIdentity = (car) => car.vin || car.chassisNumber || car.licensePlate || 'Chưa có dữ liệu'
const stockClass = (stock) => ({ low: Number(stock) > 0 && Number(stock) <= 3, empty: Number(stock || 0) === 0 })
const statusLabel = (status) => ({
  AVAILABLE: 'Có sẵn',
  DEPOSITED: 'Đã đặt cọc',
  SOLD: 'Đã bán',
  INACTIVE: 'Ngừng kinh doanh',
}[status] || status || 'Chưa xác định')
const statusClass = (status) => String(status || '').toLowerCase()
</script>

<style scoped>
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem
}

.admin-eyebrow {
  font-size: .72rem;
  font-weight: 800;
  letter-spacing: .08em;
  color: #dc2626
}

.page-description {
  margin-top: .4rem;
  color: #6b7280
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem
}

.summary-grid article {
  padding: 1.1rem 1.25rem;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(31, 41, 55, .06)
}

.summary-grid span,
.summary-grid strong {
  display: block
}

.summary-grid span {
  font-size: .85rem;
  color: #6b7280
}

.summary-grid strong {
  margin-top: .25rem;
  font-size: 1.65rem;
  color: #111827
}

.cs-card {
  box-shadow: 0 10px 30px rgba(31, 41, 55, .08)
}

.cs-table {
  color: #374151
}

.cs-table thead th {
  color: #6b7280;
  background: #f9fafb;
  white-space: nowrap
}

.cs-table tbody tr:hover {
  background: #f9fafb
}

.car-cell {
  display: flex;
  align-items: center;
  gap: .75rem;
  min-width: 220px
}

.car-cell img {
  width: 72px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #f3f4f6
}

.car-cell strong,
.car-cell small {
  display: block
}

.car-cell small {
  margin-top: .15rem;
  color: #9ca3af
}

.identity-cell {
  color: #6b7280
}

.stock-badge,
.status-badge {
  display: inline-block;
  border-radius: 999px;
  font-weight: 700
}

.stock-badge {
  min-width: 42px;
  padding: .35rem .6rem;
  text-align: center;
  background: #dcfce7;
  color: #166534
}

.stock-badge.low {
  background: #fef3c7;
  color: #92400e
}

.stock-badge.empty {
  background: #fee2e2;
  color: #991b1b
}

.status-badge {
  padding: .35rem .65rem;
  background: #f3f4f6;
  color: #4b5563;
  white-space: nowrap
}

.status-badge.available {
  background: #dcfce7;
  color: #166534
}

.status-badge.deposited {
  background: #fef3c7;
  color: #92400e
}

.status-badge.sold,
.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b
}

.empty-cell {
  text-align: center;
  color: #6b7280;
  padding: 2.5rem !important
}

@media(max-width:991.98px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr))
  }
}

@media(max-width:575.98px) {
  .page-heading {
    align-items: stretch;
    flex-direction: column
  }

  .page-heading .btn {
    width: 100%
  }

  .summary-grid {
    grid-template-columns: 1fr 1fr
  }
}
</style>
