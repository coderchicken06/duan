<template>
  <div class="container cs-container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div><span class="admin-eyebrow">KHO XE</span><h2 class="cs-page-title mb-0">Quản lý tồn kho</h2></div>
      <router-link class="btn cs-btn cs-btn-primary" to="/car/create">+ Thêm xe</router-link>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>ID</th><th>Tên</th><th>Giá</th><th>Tồn</th><th></th></tr></thead>
        <tbody>
          <tr v-for="car in cars" :key="car.id">
            <td>{{ car.id }}</td>
            <td>{{ car.name }}</td>
            <td>{{ formatPrice(car.price) }}</td>
            <td><span class="stock-badge" :class="{ low: car.stock <= 3 }">{{ car.stock }}</span></td>
            <td>
              <router-link :to="`/car/edit/${car.id}`" class="btn btn-sm cs-btn-ghost me-1">Sửa</router-link>
              <button class="btn btn-sm cs-btn-danger" @click="remove(car.id)">Xóa</button>
            </td>
          </tr>
          <tr v-if="cars.length === 0"><td colspan="5" class="empty-cell">Chưa có xe trong kho.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi, formatPrice } from '../../api'

const cars = ref([])

onMounted(load)

async function load() {
  const { data } = await adminApi.getCars()
  cars.value = Array.isArray(data) ? data : data.data || []
}

async function remove(id) {
  if (!confirm('Xóa xe này?')) return
  await adminApi.deleteCar(id)
  await load()
}
</script>
<style scoped>.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.cs-card{box-shadow:0 10px 30px rgba(31,41,55,.08)}.cs-table{color:#374151}.cs-table thead th{color:#6b7280;background:#f9fafb}.cs-table tbody tr:hover{background:#fffafa}.stock-badge{display:inline-block;min-width:38px;text-align:center;padding:.3rem .55rem;border-radius:999px;background:#dcfce7;color:#166534;font-weight:700}.stock-badge.low{background:#fee2e2;color:#991b1b}.empty-cell{text-align:center;color:#6b7280;padding:2.5rem!important}@media(max-width:575.98px){.container>div:first-child{align-items:flex-start!important;gap:1rem;flex-direction:column}.container>div:first-child .btn{width:100%}}</style>
