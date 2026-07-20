<template>
  <section class="admin-dashboard">
    <div class="container cs-container dashboard-inner">
      <header class="dashboard-heading">
        <div>
          <span class="dashboard-eyebrow">TỔNG QUAN HỆ THỐNG</span>
          <h1>Bảng thống kê</h1>
          <p>Theo dõi nhanh dữ liệu kinh doanh hiện tại của CarStore.</p>
        </div>
        <span class="dashboard-status"><i></i>Dữ liệu trực tiếp</span>
      </header>

      <div v-if="loading" class="dashboard-message">Đang tải dữ liệu thống kê...</div>
      <div v-else-if="errorMessage" class="dashboard-message dashboard-message--error">
        {{ errorMessage }}
      </div>

      <template v-else>
        <div class="stat-grid">
          <article v-for="item in statCards" :key="item.label" class="stat-card">
            <span class="stat-icon" :class="`stat-icon--${item.tone}`">{{ item.symbol }}</span>
            <div>
              <span class="stat-label">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
              <small>{{ item.description }}</small>
            </div>
          </article>
        </div>

        <div class="dashboard-grid">
          <article class="dashboard-card revenue-card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">TÀI CHÍNH</span>
                <h2>Doanh thu đơn hàng</h2>
              </div>
              <span class="revenue-mark">VNĐ</span>
            </div>
            <strong class="revenue-value">{{ formatPrice(revenue) }}</strong>
            <p>Tổng giá trị ghi nhận từ các đơn hàng trong hệ thống.</p>
          </article>

          <article class="dashboard-card">
            <div class="card-heading">
              <div>
                <span class="card-kicker">SẢN PHẨM</span>
                <h2>Top xe bán chạy</h2>
              </div>
              <span class="top-total">{{ totalTopSales }} xe</span>
            </div>

            <div v-if="topCars.length" class="top-list">
              <div v-for="(car, index) in topCars" :key="`${car.name}-${index}`" class="top-row">
                <span class="top-rank">{{ index + 1 }}</span>
                <div class="top-info">
                  <div>
                    <strong>{{ car.name }}</strong>
                    <span>{{ car.qty }} xe đã bán</span>
                  </div>
                  <div class="top-track">
                    <span :style="{ width: `${salePercentage(car.qty)}%` }"></span>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="empty-top">Chưa có dữ liệu bán hàng.</p>
          </article>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { adminApi, formatPrice } from '../../api'

interface DashboardStats {
  totalCars: number
  totalUsers: number
  totalOrders: number
  totalBrands: number
}

interface TopCar {
  name: string
  qty: number
}

const stats = ref<DashboardStats>({
  totalCars: 0,
  totalUsers: 0,
  totalOrders: 0,
  totalBrands: 0,
})
const revenue = ref(0)
const topCars = ref<TopCar[]>([])
const loading = ref(true)
const errorMessage = ref('')

const statCards = computed(() => [
  { label: 'Mẫu xe', value: stats.value.totalCars, description: 'Sản phẩm đang quản lý', symbol: '01', tone: 'blue' },
  { label: 'Khách hàng', value: stats.value.totalUsers, description: 'Tài khoản trong hệ thống', symbol: '02', tone: 'green' },
  { label: 'Đơn hàng', value: stats.value.totalOrders, description: 'Tổng đơn đã tạo', symbol: '03', tone: 'orange' },
  { label: 'Thương hiệu', value: stats.value.totalBrands, description: 'Hãng xe đang phân phối', symbol: '04', tone: 'red' },
])

const totalTopSales = computed(() => topCars.value.reduce((sum, car) => sum + car.qty, 0))
const highestSales = computed(() => Math.max(...topCars.value.map((car) => car.qty), 1))

function salePercentage(quantity: number) {
  return Math.max(8, Math.round((quantity / highestSales.value) * 100))
}

onMounted(async () => {
  try {
    const { data } = await adminApi.getDashboardInfo()
    if (!data?.success) throw new Error(data?.message || 'Không thể tải số liệu tổng quan')

    stats.value = {
      totalCars: Number(data.stats?.totalCars || 0),
      totalUsers: Number(data.stats?.totalUsers || 0),
      totalOrders: Number(data.stats?.totalOrders || 0),
      totalBrands: Number(data.stats?.totalBrands || 0),
    }
    revenue.value = Number(data.stats?.revenue || 0)
    const raw = Array.isArray(data.topCars) ? data.topCars : []
    topCars.value = raw.map((row: unknown[]) => ({
      name: String(row[0] || 'Chưa cập nhật'),
      qty: Number(row[1] || 0),
    }))
  } catch (error) {
    console.error('Không thể tải dashboard:', error)
    errorMessage.value = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-dashboard{background:linear-gradient(180deg,#f4f6f9 0,#fff 100%);min-height:calc(100vh - 72px)}
.dashboard-inner{padding-bottom:64px;padding-top:42px}
.dashboard-heading{align-items:flex-end;display:flex;justify-content:space-between;margin-bottom:28px}
.dashboard-eyebrow,.card-kicker{color:#c81e2b;font-size:.74rem;font-weight:800;letter-spacing:.14em}
.dashboard-heading h1{color:#111827;font-size:2rem;font-weight:800;margin:6px 0}
.dashboard-heading p{color:#6b7280;margin:0}
.dashboard-status{align-items:center;background:#ecfdf5;border:1px solid #bbf7d0;border-radius:999px;color:#166534;display:flex;font-size:.82rem;font-weight:700;gap:8px;padding:8px 13px}
.dashboard-status i{background:#22c55e;border-radius:50%;height:8px;width:8px}
.stat-grid{display:grid;gap:18px;grid-template-columns:repeat(4,1fr)}
.stat-card{align-items:center;background:#fff;border:1px solid #e7eaf0;border-radius:16px;box-shadow:0 10px 28px rgba(15,23,42,.06);display:flex;gap:16px;padding:22px}
.stat-icon{align-items:center;border-radius:12px;display:flex;font-size:.72rem;font-weight:900;height:48px;justify-content:center;letter-spacing:.06em;min-width:48px}
.stat-icon--blue{background:#eff6ff;color:#2563eb}.stat-icon--green{background:#ecfdf5;color:#059669}.stat-icon--orange{background:#fff7ed;color:#ea580c}.stat-icon--red{background:#fef2f2;color:#dc2626}
.stat-card>div{display:flex;flex-direction:column;min-width:0}.stat-label{color:#6b7280;font-size:.84rem;font-weight:700}.stat-card strong{color:#111827;font-size:1.75rem;line-height:1.15;margin:3px 0}.stat-card small{color:#9ca3af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dashboard-grid{display:grid;gap:20px;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);margin-top:20px}
.dashboard-card{background:#fff;border:1px solid #e7eaf0;border-radius:16px;box-shadow:0 10px 28px rgba(15,23,42,.06);padding:28px}
.card-heading{align-items:flex-start;display:flex;justify-content:space-between}.card-heading h2{color:#111827;font-size:1.15rem;font-weight:800;margin:5px 0 0}
.revenue-card{background:linear-gradient(135deg,#172234,#273449);border:0;color:#fff}.revenue-card .card-kicker{color:#f87171}.revenue-card h2{color:#fff}.revenue-mark{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:9px;color:#cbd5e1;font-size:.72rem;font-weight:800;padding:7px 9px}
.revenue-value{display:block;font-size:clamp(2rem,3.5vw,2.8rem);letter-spacing:-.04em;margin:34px 0 9px}.revenue-card p{color:#cbd5e1;font-size:.88rem;margin:0;max-width:390px}
.top-total{background:#f3f4f6;border-radius:999px;color:#4b5563;font-size:.78rem;font-weight:800;padding:7px 11px}
.top-list{display:grid;gap:18px;margin-top:26px}.top-row{align-items:center;display:flex;gap:14px}.top-rank{align-items:center;background:#fef2f2;border-radius:10px;color:#b91c1c;display:flex;font-weight:800;height:38px;justify-content:center;min-width:38px}.top-info{flex:1}.top-info>div:first-child{display:flex;justify-content:space-between}.top-info strong{font-size:.92rem}.top-info span{color:#6b7280;font-size:.82rem}.top-track{background:#edf0f4;border-radius:99px;height:6px;margin-top:9px;overflow:hidden}.top-track span{background:linear-gradient(90deg,#dc2626,#f87171);border-radius:inherit;display:block;height:100%}.empty-top{color:#6b7280;margin:32px 0 0}.dashboard-message{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:48px;text-align:center}.dashboard-message--error{color:#b91c1c}
@media(max-width:1050px){.stat-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.dashboard-heading{align-items:flex-start;flex-direction:column;gap:18px}.dashboard-grid{grid-template-columns:1fr}.dashboard-inner{padding-top:28px}}@media(max-width:520px){.stat-grid{grid-template-columns:1fr}.dashboard-card{padding:22px}}
</style>
