<template>
  <div class="container cs-container py-5" v-if="order">
    <h2 class="cs-page-title mb-4">Chi tiết đơn hàng #{{ order.id }}</h2>
    <div class="cs-card p-4 mb-4">
      <p><strong>Khách hàng:</strong> {{ order.username }}</p>
      <p><strong>Địa chỉ:</strong> {{ order.address }}</p>
      <p><strong>Trạng thái:</strong> {{ order.status }}</p>
      <p><strong>Ngày đặt:</strong> {{ formatDate(order.create_date) }}</p>
      <p><strong>Trạng thái tiền cọc:</strong> {{ order.depositStatus || 'UNPAID' }}</p>
      <p v-if="order.depositAmount"><strong>Tiền cọc:</strong> {{ formatPrice(order.depositAmount) }} VNĐ</p>
      <div class="d-flex flex-wrap gap-2 mb-3">
        <router-link class="btn cs-btn cs-btn-ghost" :to="`/orders/${order.id}/contract`">Xem hợp đồng</router-link>
        <router-link class="btn cs-btn cs-btn-primary" :to="`/orders/${order.id}/payment`">Thanh toán & lịch sử</router-link>
      </div>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Xe</th><th>Giá</th><th>SL</th><th>Thành tiền</th></tr></thead>
        <tbody>
          <tr v-for="d in details" :key="d.id">
            <td>{{ d.car?.name || 'Xe không còn tồn tại' }}</td>
            <td>{{ formatPrice(d.price) }}</td>
            <td>{{ d.quantity }}</td>
            <td>{{ formatPrice(d.price * d.quantity) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <router-link class="btn cs-btn cs-btn-ghost mt-3" to="/order/my-orders">Quay lại</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { orderApi, formatPrice } from '../api'

const route = useRoute()
const order = ref(null)
const details = ref([])

onMounted(async () => {
  const { data } = await orderApi.getDetails(String(route.params.id))
  if (data.success) {
    order.value = data.order
    details.value = data.details || []
  }
})

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : ''
}
</script>
