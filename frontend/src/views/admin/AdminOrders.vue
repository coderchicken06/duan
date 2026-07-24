<template>
  <div class="container cs-container py-5">
    <span class="admin-eyebrow">ĐƠN ĐẶT XE</span><h2 class="cs-page-title mb-4">Quản lý đơn hàng</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>ID</th><th>KH</th><th>Địa chỉ</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>#{{ o.id }}</td>
            <td>{{ o.username }}</td>
            <td>{{ o.address }}</td>
            <td>
              <select v-model="o.status" class="form-select form-select-sm" @change="updateStatus(o)">
                <option value="PENDING">PENDING - Chờ duyệt</option>
                <option value="CONFIRMED">CONFIRMED - Đã duyệt, chờ cọc</option>
                <option value="PROCESSING">PROCESSING - Đã cọc, xử lý xe</option>
                <option value="DELIVERED">DELIVERED - Hoàn thành</option>
                <option value="CANCELLED">CANCELLED - Đã hủy</option>
              </select>
            </td>
            <td><button class="btn btn-sm cs-btn-danger" @click="remove(o.id)">Xóa</button></td>
          </tr>
          <tr v-if="orders.length === 0"><td colspan="5" class="empty-cell">Chưa có đơn hàng nào.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api'

const orders = ref([])

onMounted(load)

async function load() {
  const { data } = await adminApi.getOrders()
  orders.value = Array.isArray(data) ? data : data.data || []
}

async function updateStatus(o) {
  const { data } = await adminApi.updateOrderStatus(o.id, o.status)
  if (!data.success) alert(data.message || 'Không thể cập nhật trạng thái')
  await load()
}

async function remove(id) {
  if (!confirm('Xóa đơn hàng?')) return
  const { data } = await adminApi.deleteOrder(id)
  if (!data.success) alert(data.message || 'Không thể xóa đơn hàng')
  await load()
}
</script>
<style scoped>.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.cs-card{box-shadow:0 10px 30px rgba(31,41,55,.08)}.cs-table{color:#374151}.cs-table thead th{color:#6b7280;background:#f9fafb}.cs-table tbody tr:hover{background:#fffafa}.form-select{min-width:235px;background-color:#fff;color:#374151;border-color:#d1d5db;font-weight:600}.empty-cell{text-align:center;color:#6b7280;padding:2.5rem!important}</style>
