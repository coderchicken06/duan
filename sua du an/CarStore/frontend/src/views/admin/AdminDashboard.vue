<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Bảng thống kê</h2>
    <div class="row g-4 mb-4">
      <div class="col-md-3" v-for="(val, key) in stats" :key="key">
        <div class="cs-card p-4 text-center">
          <div class="fs-3 fw-bold text-primary">{{ val }}</div>
          <div class="cs-muted text-capitalize">{{ key }}</div>
        </div>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-md-6">
        <div class="cs-card p-4">
          <h5>Doanh thu</h5>
          <p class="fs-4 fw-bold text-danger">{{ formatPrice(revenue) }} VNĐ</p>
        </div>
      </div>
      <div class="col-md-6">
        <div class="cs-card p-4">
          <h5>Top xe bán chạy</h5>
          <ul class="list-unstyled mb-0">
            <li v-for="(c, i) in topCars" :key="i">{{ c.name }} — {{ c.qty }} xe</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi, formatPrice } from '../../api'

const stats = ref({})
const revenue = ref(0)
const topCars = ref([])

onMounted(async () => {
  const [s, r, t] = await Promise.all([
    adminApi.getStats(),
    adminApi.getRevenue(),
    adminApi.getTopCars(),
  ])
  if (s.data?.success) {
    stats.value = {
      totalCars: s.data.totalCars,
      totalUsers: s.data.totalUsers,
      totalOrders: s.data.totalOrders,
      totalBrands: s.data.totalBrands,
    }
  }
  revenue.value = r.data?.revenue ?? 0
  const raw = t.data?.data || []
  topCars.value = raw.map((row) => ({ name: row[0], qty: row[1] }))
})
</script>
