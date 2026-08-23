<template>
  <div class="container cs-container py-5">
    <div class="page-heading">
      <div>
        <span class="admin-eyebrow">DANH MỤC XE</span>
        <h2 class="cs-page-title mb-0">Quản lý sản phẩm</h2>
        <p class="page-description mb-0">Thêm mới, cập nhật và quản lý thông tin xe đang kinh doanh.</p>
      </div>
      <router-link class="btn cs-btn cs-btn-primary" to="/car/create">+ Thêm xe</router-link>
    </div>

    <div class="table-responsive cs-card p-3">
      <table class="table cs-table align-middle mb-0">
        <thead>
          <tr><th>Xe</th><th>Thương hiệu</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th class="text-end">Thao tác</th></tr>
        </thead>
        <tbody>
          <tr v-if="loading"><td colspan="6" class="empty-cell">Đang tải danh sách sản phẩm...</td></tr>
          <tr v-for="car in cars" v-else :key="car.id">
            <td>
              <div class="car-cell">
                <img :src="carImageUrl(car.image)" :alt="car.name" @error="useDefaultCarImage" />
                <div><strong>{{ car.name }}</strong><small>ID: {{ car.id }}</small></div>
              </div>
            </td>
            <td>{{ brandName(car.brandId) }}</td>
            <td>{{ formatPrice(car.price) }} đ</td>
            <td><span class="stock-badge" :class="{ low: car.stock <= 3 }">{{ car.stock }}</span></td>
            <td><span class="status-badge" :class="statusClass(car.status)">{{ statusLabel(car.status) }}</span></td>
            <td class="text-end action-cell">
              <router-link :to="`/car/edit/${car.id}`" class="btn btn-sm cs-btn-ghost">Sửa</router-link>
              <button class="btn btn-sm cs-btn-danger" type="button" :disabled="submitting" @click="remove(car)">
                {{ submitting ? 'Đang xử lý...' : 'Xóa' }}
              </button>
            </td>
          </tr>
          <tr v-if="!loading && cars.length === 0"><td colspan="6" class="empty-cell">Chưa có sản phẩm.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi, carImageUrl, formatPrice, useDefaultCarImage } from '../../api'
import { showCartToast } from '../../composables/useCartToast'

const cars = ref([])
const brands = ref([])
const loading = ref(false)
const submitting = ref(false)
const route = useRoute()
const brandMap = computed(() => new Map(brands.value.map((brand) => [Number(brand.id), brand.name])))

onMounted(load)
watch(() => route.path, load)

async function load() {
  loading.value = true
  try {
    const [carResponse, brandResponse] = await Promise.all([adminApi.getCars(), adminApi.getBrands()])
    cars.value = Array.isArray(carResponse.data) ? carResponse.data : carResponse.data.data || []
    brands.value = Array.isArray(brandResponse.data) ? brandResponse.data : brandResponse.data.data || []
  } catch (error) {
    showCartToast(error.response?.data?.message || 'Không thể tải danh sách sản phẩm', 'error')
  } finally {
    loading.value = false
  }
}

async function remove(car) {
  if (submitting.value) return
  if (!confirm(`Xóa xe “${car.name}”?`)) return
  const previousCars = cars.value
  cars.value = cars.value.filter((item) => item.id !== car.id)
  submitting.value = true
  try {
    const { data } = await adminApi.deleteCar(car.id)
    if (data.success === false) {
      cars.value = previousCars
      showCartToast(data.message || 'Không thể xóa xe', 'error')
      return
    }
    showCartToast(data.message || 'Đã xóa xe thành công')
  } catch (error) {
    cars.value = previousCars
    showCartToast(error.response?.data?.message || 'Không thể xóa xe', 'error')
  } finally {
    submitting.value = false
  }
}

const brandName = (brandId) => brandMap.value.get(Number(brandId)) || 'Chưa xác định'
const statusLabel = (status) => ({
  AVAILABLE: 'Có sẵn',
  DEPOSITED: 'Đã đặt cọc',
  SOLD: 'Đã bán',
  INACTIVE: 'Ngừng kinh doanh',
}[status] || status || 'Chưa xác định')
const statusClass = (status) => String(status || '').toLowerCase()
</script>

<style scoped>
.page-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:1rem;margin-bottom:1.5rem}.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.page-description{margin-top:.4rem;color:#6b7280}.cs-card{box-shadow:0 10px 30px rgba(31,41,55,.08)}.cs-table{color:#374151}.cs-table thead th{color:#6b7280;background:#f9fafb;white-space:nowrap}.cs-table tbody tr:hover{background:#fffafa}.car-cell{display:flex;align-items:center;gap:.75rem;min-width:220px}.car-cell img{width:72px;height:48px;object-fit:cover;border-radius:8px;background:#f3f4f6}.car-cell strong,.car-cell small{display:block}.car-cell small{margin-top:.15rem;color:#9ca3af}.stock-badge,.status-badge{display:inline-block;border-radius:999px;font-weight:700}.stock-badge{min-width:38px;padding:.3rem .55rem;text-align:center;background:#dcfce7;color:#166534}.stock-badge.low{background:#fee2e2;color:#991b1b}.status-badge{padding:.35rem .65rem;background:#f3f4f6;color:#4b5563;white-space:nowrap}.status-badge.available{background:#dcfce7;color:#166534}.status-badge.deposited{background:#fef3c7;color:#92400e}.status-badge.sold,.status-badge.inactive{background:#fee2e2;color:#991b1b}.action-cell{white-space:nowrap}.action-cell .btn+.btn{margin-left:.4rem}.empty-cell{text-align:center;color:#6b7280;padding:2.5rem!important}.btn:disabled{cursor:wait;opacity:.65}@media(max-width:575.98px){.page-heading{align-items:stretch;flex-direction:column}.page-heading .btn{width:100%}}
</style>
