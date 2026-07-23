<template>
  <div class="container cs-container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="cs-page-title mb-0">Quản lý khách hàng</h2>
      <router-link class="btn cs-btn cs-btn-primary" to="/admin/users/create">Thêm user</router-link>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Username</th><th>Họ tên</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.username">
            <td>{{ u.username }}</td>
            <td>{{ u.fullname }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.role }}</td>
            <td>
              <router-link :to="`/admin/users/edit/${u.username}`" class="btn btn-sm cs-btn-ghost me-1">Sửa</router-link>
              <button class="btn btn-sm cs-btn-danger" @click="remove(u.username)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '../../api'

const users = ref([])

onMounted(load)

async function load() {
  const { data } = await adminApi.getUsers()
  users.value = Array.isArray(data) ? data : data.data || []
}

async function remove(username) {
  if (!confirm('Xóa user?')) return
  await adminApi.deleteUser(username)
  await load()
}
</script>
