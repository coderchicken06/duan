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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supportApi } from '../api'

const requests = ref([])

onMounted(async () => {
  const { data } = await supportApi.getMy()
  requests.value = data.data || []
})
</script>
