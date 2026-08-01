<template>
  <div class="container cs-container py-5">
    <span class="admin-eyebrow">ĐƠN ĐẶT XE</span>
    <h2 class="cs-page-title mb-4">Quản lý đơn hàng</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>KH</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>#{{ o.id }}</td>
            <td>{{ o.username }}</td>
            <td>{{ o.address }}</td>
            <td>
              <select v-model="o.status" class="form-select form-select-sm"
                :disabled="['CANCELLED', 'DELIVERED'].includes(o.status)" @change="updateStatus(o)">
                <option v-for="status in availableStatuses(o)" :key="status" :value="status">
                  {{ statusLabels[status] }}
                </option>
              </select>
            </td>
            <td>
              <button v-if="!['CANCELLED', 'DELIVERED'].includes(o.status)" class="btn btn-sm cs-btn-danger"
                @click="cancel(o)">Hủy đơn</button>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="5" class="empty-cell">Chưa có đơn hàng nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { adminApi } from '../../api'

const orders = ref([])
let pollInterval = null
const statusLabels = {
  PENDING: 'PENDING - Chờ duyệt',
  CONFIRMED: 'CONFIRMED - Đã duyệt, chờ cọc',
  PROCESSING: 'PROCESSING - Đã cọc, xử lý xe',
  DELIVERED: 'DELIVERED - Hoàn thành',
  CANCELLED: 'CANCELLED - Đã hủy',
}

function availableStatuses(order) {
  if (order.status === 'PENDING') return ['PENDING', 'CONFIRMED', 'CANCELLED']
  if (order.status === 'CONFIRMED') {
    return order.depositStatus === 'PAID'
      ? ['CONFIRMED', 'PROCESSING']
      : ['CONFIRMED', 'CANCELLED']
  }
  if (order.status === 'PROCESSING') return ['PROCESSING', 'DELIVERED']
  return [order.status]
}

onMounted(() => {
  load()
  // Tự động làm mới danh sách đơn hàng mỗi 5 giây để cập nhật trạng thái khi khách cọc thành công
  pollInterval = setInterval(loadSilent, 5000)
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

async function load() {
  try {
    const { data } = await adminApi.getOrders()
    orders.value = Array.isArray(data) ? data : data.data || []
  } catch (e) {
    console.error('Lỗi tải danh sách đơn hàng:', e)
  }
}

// Hàm load ngầm không làm gián đoạn thao tác chọn select của admin
async function loadSilent() {
  try {
    const { data } = await adminApi.getOrders()
    const latestOrders = Array.isArray(data) ? data : data.data || []

    // Chỉ cập nhật lại nếu có sự thay đổi về dữ liệu để tránh làm reset lại trạng thái giao diện UI
    if (JSON.stringify(orders.value) !== JSON.stringify(latestOrders)) {
      orders.value = latestOrders
    }
  } catch (e) {
    // Bỏ qua lỗi ngầm trong lúc polling
  }
}

async function updateStatus(o) {
  try {
    const { data } = await adminApi.updateOrderStatus(o.id, o.status)
    if (!data.success) alert(data.message || 'Không thể cập nhật trạng thái')
  } catch (error) {
    alert(error.response?.data?.message || 'Không thể cập nhật trạng thái')
  } finally {
    await load()
  }
}

async function cancel(order) {
  if (!confirm('Hủy đơn hàng này? Tồn kho sẽ được hoàn lại nếu đơn chưa thanh toán cọc.')) return
  try {
    const { data } = await adminApi.updateOrderStatus(order.id, 'CANCELLED')
    if (!data.success) alert(data.message || 'Không thể hủy đơn hàng')
  } catch (error) {
    alert(error.response?.data?.message || 'Không thể hủy đơn hàng')
  } finally {
    await load()
  }
}
</script>
<style
  scoped>
  .admin-eyebrow {
    font-size: .72rem;
    font-weight: 800;
    letter-spacing: .08em;
    color: #dc2626
  }

  .cs-card {
    box-shadow: 0 10px 30px rgba(31, 41, 55, .08)
  }

  .cs-table {
    color: #374151
  }

  .cs-table thead th {
    color: #6b7280;
    background: #f9fafb
  }

  .cs-table tbody tr:hover {
    background: #fffafa
  }

  .form-select {
    min-width: 235px;
    background-color: #fff;
    color: #374151;
    border-color: #d1d5db;
    font-weight: 600
  }

  .empty-cell {
    text-align: center;
    color: #6b7280;
    padding: 2.5rem !important
  }
</style>
