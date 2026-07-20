<template>
  <div class="container cs-container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="cs-page-title mb-0">Quản lý tồn kho</h2>
      <router-link class="btn cs-btn cs-btn-primary" to="/car/create">Thêm xe</router-link>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>ID</th><th>Tên</th><th>Giá</th><th>Tồn</th><th></th></tr></thead>
        <tbody>
          <tr v-for="car in cars" :key="car.id">
            <td>{{ car.id }}</td>
            <td>{{ car.name }}</td>
            <td>{{ formatPrice(car.price) }}</td>
            <td>{{ car.stock }}</td>
            <td>
              <router-link :to="`/car/edit/${car.id}`" class="btn btn-sm cs-btn-ghost me-1">Sửa</router-link>
              <button class="btn btn-sm cs-btn-danger" @click="remove(car.id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
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
