<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Quản lý đơn hàng</h2>
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
  await adminApi.updateOrderStatus(o.id, o.status)
}

async function remove(id) {
  if (!confirm('Xóa đơn hàng?')) return
  await adminApi.deleteOrder(id)
  await load()
}
</script>
