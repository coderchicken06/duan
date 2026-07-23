<template>
  <div class="container cs-container py-5">
    <span class="admin-eyebrow">CHĂM SÓC KHÁCH HÀNG</span><h2 class="cs-page-title mb-4">Quản lý yêu cầu hỗ trợ</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>ID</th><th>KH</th><th>Loại</th><th>Nội dung</th><th>Trạng thái</th><th></th></tr></thead>
        <tbody>
          <tr v-for="r in requests" :key="r.id">
            <td>{{ r.id }}</td>
            <td>{{ r.name }} ({{ r.phone }})</td>
            <td>{{ r.type }}</td>
            <td>{{ r.content }}</td>
            <td>
              <select v-model="r.status" class="form-select form-select-sm" @change="updateStatus(r)">
                <option>Chờ xử lý</option>
                <option>Đang xử lý</option>
                <option>Hoàn thành</option>
              </select>
            </td>
            <td><button class="btn btn-sm cs-btn-danger" @click="remove(r.id)">Xóa</button></td>
          </tr>
          <tr v-if="requests.length === 0"><td colspan="6" class="empty-cell">Chưa có yêu cầu hỗ trợ nào.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supportApi } from '../../api'

const requests = ref([])

onMounted(load)

async function load() {
  const { data } = await supportApi.getAll()
  requests.value = data.data || []
}

async function updateStatus(r) {
  await supportApi.updateStatus(r.id, r.status)
}

async function remove(id) {
  if (!confirm('Xóa yêu cầu?')) return
  await supportApi.delete(id)
  await load()
}
</script>
<style scoped>.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.cs-card{box-shadow:0 10px 30px rgba(31,41,55,.08)}.cs-table{color:#374151}.cs-table thead th{color:#6b7280;background:#f9fafb}.cs-table tbody tr:hover{background:#fffafa}.form-select{min-width:145px;background-color:#fff;color:#374151;border-color:#d1d5db}.empty-cell{text-align:center;color:#6b7280;padding:2.5rem!important}</style>
