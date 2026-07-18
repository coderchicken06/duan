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
      <div v-if="order.status === 'CONFIRMED' && order.depositStatus !== 'PAID'" class="border-top pt-3 mt-3">
        <h5>Thanh toán tiền cọc 10%</h5>
        <p class="cs-muted">Chỉ hiển thị sau khi quản trị viên duyệt đơn.</p>
        <select v-model="paymentMethod" class="form-select mb-3">
          <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
          <option value="VNPAY">VNPay mô phỏng</option>
          <option value="CASH_AT_SHOWROOM">Thanh toán tại showroom</option>
        </select>
        <button class="btn cs-btn cs-btn-primary" @click="payDeposit">Thanh toán tiền cọc</button>
      </div>
      <div v-if="message" class="alert mt-3" :class="ok ? 'alert-success' : 'alert-danger'">{{ message }}</div>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Xe</th><th>Giá</th><th>SL</th><th>Thành tiền</th></tr></thead>
        <tbody>
          <tr v-for="d in details" :key="d.id">
            <td>{{ d.carName || d.carId }}</td>
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
const paymentMethod = ref('BANK_TRANSFER')
const message = ref('')
const ok = ref(false)

onMounted(async () => {
  const { data } = await orderApi.getDetails(route.params.id)
  if (data.success) {
    order.value = data.order
    details.value = data.details || []
  }
})

async function payDeposit() {
  const { data } = await orderApi.payDeposit(order.value.id, paymentMethod.value)
  ok.value = data.success
  message.value = data.message
  if (data.success) order.value = data.data
}

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : ''
}
</script>
