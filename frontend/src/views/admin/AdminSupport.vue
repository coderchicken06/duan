<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Quản lý yêu cầu hỗ trợ</h2>
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
