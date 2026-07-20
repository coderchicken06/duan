<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Đơn hàng của tôi</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Mã</th><th>Ngày</th><th>Địa chỉ</th><th>Trạng thái</th><th>Tiền cọc</th><th></th></tr></thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>#{{ o.id }}</td>
            <td>{{ formatDate(o.create_date) }}</td>
            <td>{{ o.address }}</td>
            <td><span class="badge bg-secondary">{{ o.status }}</span></td>
            <td>{{ o.depositStatus === 'PAID' ? 'Đã thanh toán' : (o.status === 'CONFIRMED' ? 'Chờ thanh toán' : 'Chưa mở') }}</td>
            <td><router-link :to="`/order/detail/${o.id}`">Chi tiết</router-link></td>
          </tr>
        </tbody>
      </table>
      <p v-if="orders.length === 0" class="text-center cs-muted py-4">Chưa có đơn hàng nào.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderApi } from '../api'

const orders = ref([])

onMounted(async () => {
  const { data } = await orderApi.getMyOrders()
  orders.value = data.data || []
})

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : ''
}
</script>
