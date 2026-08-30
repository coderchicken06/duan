<template>
  <div class="container cs-container py-5">
    <span class="admin-eyebrow">ĐƠN ĐẶT XE</span>
    <h2 class="cs-page-title mb-4">Quản lý đơn hàng</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Khách hàng</th>
            <th>Địa chỉ</th>
            <th>Thời gian thanh toán cọc</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>
              <div class="product-cell">
                <img v-if="o.carImage" :src="carImageUrl(o.carImage)" :alt="o.carName || o.productName" @error="useDefaultCarImage" />
                <span>{{ o.carName || o.productName }}</span>
              </div>
            </td>
            <td>{{ o.username }}</td>
            <td>{{ o.address }}</td>
            <td>{{ formatDepositPaidAt(o) }}</td>
            <td>
              <select :value="o.status" class="form-select form-select-sm"
                :disabled="isSubmitting(o.id) || ['CANCELLED', 'DELIVERED'].includes(o.status)"
                @change="updateStatus(o, $event.target.value)">
                <option v-for="status in availableStatuses(o)" :key="status" :value="status">
                  {{ statusLabels[status] }}
                </option>
              </select>
            </td>
            <td>
              <button v-if="!['CANCELLED', 'DELIVERED'].includes(o.status)" class="btn btn-sm cs-btn-danger"
                :disabled="isSubmitting(o.id)" @click="cancel(o)">{{ isSubmitting(o.id) ? 'Đang xử lý...' : 'Hủy đơn'
                }}</button>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="6" class="empty-cell">Chưa có đơn hàng nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi, carImageUrl, useDefaultCarImage } from '../../api'
import { showCartToast } from '../../composables/useCartToast'
import { notifyDataUpdated, useAutoRefresh } from '../../composables/useAutoRefresh'

const orders = ref([])
const submittingOrderId = ref(null)
const route = useRoute()
const statusLabels = {
  PENDING: 'PENDING - Chờ duyệt',
  CONFIRMED: 'CONFIRMED - Đã duyệt, chờ cọc',
  PROCESSING: 'PROCESSING - Đã cọc, xử lý xe',
  DELIVERED: 'DELIVERED - Hoàn thành',
  CANCELLED: 'CANCELLED - Đã hủy',
}

function formatDepositPaidAt(order) {
  const paymentTime = order.paidAt || order.paymentTime
  if (paymentTime) {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(paymentTime))
  }
  const status = String(order.status || '').toUpperCase()
  const depositStatus = String(order.depositStatus || '').toUpperCase()
  return ['PENDING', 'CANCELLED'].includes(status) && ['UNPAID', 'DEPOSIT_UNPAID', ''].includes(depositStatus)
    ? 'Chưa thanh toán cọc'
    : '--'
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
})
useAutoRefresh(loadSilent)

watch(() => route.fullPath, load)

async function load() {
  try {
    const { data } = await adminApi.getOrders()
    orders.value = Array.isArray(data) ? data : data.data || []
  } catch {
    showCartToast('Không thể tải danh sách đơn hàng', 'error')
  }
}

// Hàm load ngầm không làm gián đoạn thao tác chọn select của admin
async function loadSilent() {
  try {
    const { data } = await adminApi.getOrders()
    const latestOrders = Array.isArray(data) ? data : data.data || []

    // Chỉ cập nhật lại nếu có sự thay đổi về dữ liệu để tránh làm reset lại trạng thái giao diện UI
    if (JSON.stringify(orders.value) !== JSON.stringify(latestOrders)) {
      const currentOrders = new Map(orders.value.map((order) => [order.id, order]))
      orders.value = latestOrders.map((order) => isSubmitting(order.id)
        ? currentOrders.get(order.id) || order
        : order)
    }
  } catch (e) {
    // Bỏ qua lỗi ngầm trong lúc polling
  }
}

async function updateStatus(o, nextStatus) {
  if (isSubmitting(o.id)) return
  const previousStatus = o.status
  if (previousStatus === nextStatus) return
  o.status = nextStatus
  submittingOrderId.value = o.id
  try {
    const { data } = await adminApi.updateOrderStatus(o.id, nextStatus)
    if (!data.success) {
      o.status = previousStatus
      showCartToast(data.message || 'Không thể cập nhật trạng thái', 'error')
    }
    else {
      notifyDataUpdated()
      showCartToast(data.message || 'Đã cập nhật trạng thái đơn hàng')
    }
  } catch (error) {
    o.status = previousStatus
    showCartToast(error.response?.data?.message || 'Không thể cập nhật trạng thái', 'error')
  } finally {
    submittingOrderId.value = null
  }
}

async function cancel(order) {
  if (isSubmitting(order.id)) return
  if (!confirm('Hủy đơn hàng này? Tồn kho sẽ được hoàn lại nếu đơn chưa thanh toán cọc.')) return
  await updateStatus(order, 'CANCELLED')
}

const isSubmitting = (orderId) => submittingOrderId.value === orderId
</script>
<style scoped>
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

.btn:disabled,
.form-select:disabled {
  cursor: wait;
  opacity: .65
}
.product-cell { align-items: center; display: flex; gap: .65rem; min-width: 170px; }
.product-cell img { border-radius: 4px; height: 38px; object-fit: cover; width: 58px; }
</style>
