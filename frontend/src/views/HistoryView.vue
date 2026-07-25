<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Lịch sử yêu cầu hỗ trợ</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>ID</th><th>Loại</th><th>Nội dung</th><th>Trạng thái</th><th>Ngày</th></tr></thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.type }}</td>
            <td>{{ r.content }}</td>
            <td>{{ r.status }}</td>
            <td>{{ r.appointmentDate || '-' }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="requests.length === 0" class="text-center cs-muted py-4">Chưa có yêu cầu nào.</p>
    </div>
    <h2 class="cs-page-title mb-4 mt-5">Báo giá của tôi</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Mã</th><th>Ngày tạo</th><th>Tổng tiền</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody><tr v-for="quote in quotations" :key="quote.id"><td>{{ quote.quotationNo || `BG-${quote.id}` }}</td><td>{{ formatDate(quote.quotationDate) }}</td><td>{{ formatPrice(quote.totalPrice) }} VNĐ</td><td>{{ quote.status }}</td><td><router-link :to="`/quotations/${quote.id}`">Xem</router-link></td></tr></tbody>
      </table>
      <p v-if="quotations.length === 0" class="text-center cs-muted py-4">Chưa có báo giá nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supportApi, quotationApi, formatPrice } from '../api'

const requests = ref([])
const quotations = ref([])
const formatDate = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'

onMounted(async () => {
  const [supportResult, quotationResult] = await Promise.all([supportApi.getMy(), quotationApi.getMine()])
  requests.value = supportResult.data.data || []
  quotations.value = quotationResult.data.data || []
})
</script>
