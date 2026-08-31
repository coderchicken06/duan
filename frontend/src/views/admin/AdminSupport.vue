<template>
  <div class="container cs-container py-5">
    <span class="admin-eyebrow">CHĂM SÓC KHÁCH HÀNG</span>
    <h2 class="cs-page-title mb-4">Quản lý yêu cầu hỗ trợ</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>KH</th>
            <th>Loại</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.name }} ({{ r.phone }})</td>
            <td>{{ typeLabel(r.type) }}</td>
            <td>
              <div>{{ r.content }}</div>
              <small v-if="r.carInfo">Xe: {{ r.carInfo }}</small>
              <small v-if="r.serviceType">Dịch vụ: {{ r.serviceType }}</small>
              <small v-if="r.appointmentDate">
                Lịch hẹn: {{ formatAppointment(r) }}
              </small>
            </td>
            <td>
              <span v-if="isTerminal(r.status)" class="status-badge" :class="statusBadgeClass(r.status)">
                {{ r.status }}
              </span>
              <select v-else v-model="r.status" class="form-select form-select-sm" @change="updateStatus(r)">
                <option v-for="status in availableStatuses(r.status)" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </td>
            <td><button class="btn btn-sm cs-btn-danger" @click="remove(r.id)">Xóa</button></td>
          </tr>
          <tr v-if="requests.length === 0">
            <td colspan="6" class="empty-cell">Chưa có yêu cầu hỗ trợ nào.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supportApi } from '../../api'
import { showCartToast } from '../../composables/useCartToast'
import { notifyDataUpdated, useAutoRefresh } from '../../composables/useAutoRefresh'

const requests = ref([])
const typeLabel = (type) => ({
  service: 'Đặt lịch dịch vụ',
  consulting: 'Tư vấn mua xe',
  chat: 'Tư vấn trực tuyến',
  warranty: 'Bảo hành / phản hồi',
}[String(type || '').toLowerCase()] || 'Yêu cầu khác')
const STATUS_PENDING = 'Chờ xử lý'
const STATUS_PROCESSING = 'Đang xử lý'
const STATUS_DONE = 'Đã xử lý'
const STATUS_CANCELLED = 'Đã hủy'

function isTerminal(status) {
  return [STATUS_DONE, STATUS_CANCELLED].includes(String(status || '').trim())
}

function availableStatuses(status) {
  const current = String(status || '').trim()
  if (current === STATUS_PROCESSING) return [STATUS_PROCESSING, STATUS_DONE]
  if (current === STATUS_PENDING) return [STATUS_PENDING, STATUS_PROCESSING, STATUS_DONE, STATUS_CANCELLED]
  return [current]
}

function statusBadgeClass(status) {
  return String(status || '').trim() === STATUS_DONE ? 'status-done' : 'status-cancelled'
}

const formatAppointment = (request) => {
  const date = new Date(`${request.appointmentDate}T00:00:00`).toLocaleDateString('vi-VN')
  return `${date}${request.appointmentTime ? ` ${String(request.appointmentTime).slice(0, 5)}` : ''}`
}

onMounted(load)
useAutoRefresh(load)

async function load() {
  const { data } = await supportApi.getAll()
  requests.value = data.data || []
}

async function updateStatus(r) {
  try {
    await supportApi.updateStatus(r.id, r.status)
    await load()
    notifyDataUpdated()
    showCartToast('Đã cập nhật trạng thái yêu cầu')
  } catch (error) {
    await load()
    showCartToast(error.response?.data?.message || 'Không thể cập nhật trạng thái yêu cầu', 'error')
  }
}

async function remove(id) {
  if (!confirm('Xóa yêu cầu?')) return
  try {
    await supportApi.delete(id)
    await load()
    notifyDataUpdated()
    showCartToast('Đã xóa yêu cầu hỗ trợ')
  } catch (error) {
    showCartToast(error.response?.data?.message || 'Không thể xóa yêu cầu hỗ trợ', 'error')
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

  .cs-table td small {
    display: block;
    color: #6b7280;
    margin-top: 3px
  }

  .form-select {
    min-width: 145px;
    background-color: #fff;
    color: #374151;
    border-color: #d1d5db
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    min-height: 31px;
    padding: .35rem .6rem;
    border-radius: 4px;
    font-size: .78rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .status-done {
    color: #166534;
    background: #dcfce7;
  }

  .status-cancelled {
    color: #991b1b;
    background: #fee2e2;
  }

  .empty-cell {
    text-align: center;
    color: #6b7280;
    padding: 2.5rem !important
  }
</style>
