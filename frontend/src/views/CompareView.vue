<template>
  <main class="container cs-container py-5">
    <div class="compare-heading">
      <div><span class="eyebrow">CARSTORE SELECT</span>
        <h1>So sánh xe</h1>
        <p>Chọn từ 2 đến 3 xe để đối chiếu giá, vận hành, tiện nghi và tình trạng kiểm định.</p>
      </div><button class="ford-btn-outline" @click="clearAndBack">Xóa lựa chọn</button>
    </div>
    <div v-if="loading" class="text-center py-5">Đang tải...</div>
    <div v-else-if="cars.length < 2" class="ford-empty-state">Bạn cần chọn ít nhất 2 xe để so sánh.</div>
    <div v-else class="compare-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="label-col">Tiêu chí</th>
            <th v-for="car in cars" :key="car.id">
              <div class="compare-car-card">
                <div class="compare-car-img-wrapper">
                  <img class="compare-car-img" :src="carImageUrl(car.image)" :alt="car.name" @error="useCompareFallback" />
                </div>
                <div class="compare-car-info">
                  <h3 class="compare-car-name">{{ car.name }}</h3>
                  <div class="compare-car-price">{{ formatPrice(car.price) }} VNĐ</div>
                  <router-link class="compare-car-link" :to="`/car/detail/${car.id}`">Xem chi tiết</router-link>
                </div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.label">
            <td class="label-col">{{ row.label }}</td>
            <td v-for="(value, index) in row.values" :key="index" :class="{ different: row.different }">{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, carImageUrl, formatPrice } from '../api'
import { useCompare } from '../composables/useCompare'
const route = useRoute(), router = useRouter(), cars = ref([]), loading = ref(true)
const { selectedIds, clear } = useCompare()
const value = v => v === null || v === undefined || v === '' ? 'Chưa cập nhật' : v
const km = v => v == null ? 'Chưa cập nhật' : Number(v).toLocaleString('vi-VN') + ' km'
const specs = [['Giá bán', c => formatPrice(c.price) + ' VNĐ'], ['Năm sản xuất', c => value(c.year)], ['Đăng ký lần đầu', c => value(c.firstRegistration)], ['ODO', c => km(c.mileage)], ['Kiểu dáng', c => value(c.bodyType)], ['Nhiên liệu', c => value(c.fuelType || c.engineType)], ['Dung tích', c => value(c.engineCapacity)], ['Công suất', c => value(c.horsepower) + (c.horsepower ? ' HP' : '')], ['Mô-men xoắn', c => value(c.torque)], ['Hộp số', c => value(c.transmission)], ['Dẫn động', c => value(c.drivetrain)], ['Số chỗ', c => value(c.seats)], ['Tiêu hao nhiên liệu', c => value(c.fuelConsumption)], ['Ngoại thất', c => value(c.color)], ['Nội thất', c => value(c.interiorColor)], ['Bảo hành', c => value(c.warranty)], ['Kiểm định', c => value(c.inspectionLevel)], ['Đại lý', c => value(c.dealerName)]]
const rows = computed(() => specs.map(([label, fn]) => { const values = cars.value.map(fn); return { label, values, different: new Set(values).size > 1 } }))
onMounted(async () => {
  const ids = [...new Set(
    String(route.query.ids || selectedIds.value.join(','))
      .split(',')
      .map(Number)
      .filter(id => Number.isInteger(id) && id > 0),
  )].slice(0, 3)

  selectedIds.value = ids

  try {
    const responses = await Promise.all(ids.map(id => carApi.getById(id).catch(() => null)))
    cars.value = responses
      .filter(Boolean)
      .map(r => r.data?.data || r.data)
      .filter(car => car && car.id != null)
  } catch (error) {
    console.error('Không thể tải dữ liệu so sánh:', error)
    cars.value = []
  } finally {
    loading.value = false
  }
})
function clearAndBack() { clear(); router.push('/car/list') }
function useCompareFallback(event) { event.target.onerror = null; event.target.src = '/images/camry.jpg' }
</script>
<style scoped>
.compare-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  margin-bottom: 28px
}

.eyebrow {
  color: #d71920;
  font-weight: 800;
  letter-spacing: .12em
}

.compare-wrap {
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 12px
}

.compare-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse
}

.compare-table th,
.compare-table td {
  padding: 16px;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  text-align: center;
  vertical-align: middle
}

.compare-table th {
  background: #fff;
  min-width: 230px;
  vertical-align: top
}

.compare-car-card {
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 12px;
}

.compare-car-img-wrapper {
  width: 100%;
  height: 180px;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
}

.compare-car-img {
  display: block;
  height: 100%;
  object-position: center;
  object-fit: cover;
  width: 100%;
}

.compare-car-info {
  align-items: center;
  display: grid;
  grid-template-rows: minmax(44px, auto) auto auto;
  justify-items: center;
  min-height: 104px;
  width: 100%;
}

.compare-car-name {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 4px;
  text-align: center;
}

.compare-car-price {
  color: #d71920;
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 6px;
  text-align: center;
}

.label-col {
  position: sticky;
  left: 0;
  z-index: 2;
  text-align: left !important;
  font-weight: 800;
  background: #f5f5f5 !important;
  min-width: 190px !important
}

.different {
  background: #fff8d8
}

.compare-car-link {
  color: #d71920;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
}

@media(max-width:700px) {
  .compare-heading {
    align-items: start;
    flex-direction: column
  }
}
</style>
