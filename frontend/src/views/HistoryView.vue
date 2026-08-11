<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Lịch sử yêu cầu hỗ trợ</h2>

    <!-- Trạng thái đang tải -->
    <div v-if="loading" class="text-center py-5">
      <span class="spinner-border text-danger" role="status" aria-hidden="true"></span>
    </div>

    <!-- Thông báo lỗi nếu gọi API thất bại -->
    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <!-- Bảng hiển thị dữ liệu -->
    <div v-else class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Chi tiết</th>
            <th>Trạng thái</th>
            <th>Lịch hẹn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.type }}</td>
            <td>
              <div>{{ r.content }}</div>
              <small v-if="r.carInfo">Xe: {{ r.carInfo }}</small>
              <small v-if="r.serviceType">Dịch vụ: {{ r.serviceType }}</small>
            </td>
            <td>{{ r.status }}</td>
            <td>{{ formatAppointment(r) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-if="requests.length === 0" class="text-center cs-muted py-4">Chưa có yêu cầu nào.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supportApi } from '../api'
import { useAutoRefresh } from '../composables/useAutoRefresh'

const requests = ref([])
const loading = ref(true)
const error = ref('')

const formatAppointment = (request) => {
  if (!request.appointmentDate) return '-'
  const date = new Date(`${request.appointmentDate}T00:00:00`).toLocaleDateString('vi-VN')
  return `${date}${request.appointmentTime ? ` ${String(request.appointmentTime).slice(0, 5)}` : ''}`
}

async function loadRequests() {
  try {
    const supportResult = await supportApi.getMy()
    requests.value = supportResult.data.data || []
  } catch (e) {
    error.value = 'Không thể tải lịch sử yêu cầu hỗ trợ. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

onMounted(loadRequests)
useAutoRefresh(loadRequests)
</script>
