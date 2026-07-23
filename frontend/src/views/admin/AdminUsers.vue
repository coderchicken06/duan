<template>
  <div class="container cs-container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div><span class="admin-eyebrow">QUẢN TRỊ</span><h2 class="cs-page-title mb-0">Quản lý khách hàng</h2></div>
      <router-link class="btn cs-btn cs-btn-primary" to="/admin/users/create">+ Thêm người dùng</router-link>
    </div>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead><tr><th>Username</th><th>Họ tên</th><th>Email</th><th>Role</th><th></th></tr></thead>
        <tbody>
          <tr v-for="u in users" :key="u.username">
            <td>{{ u.username }}</td>
            <td>{{ u.fullname }}</td>
            <td>{{ u.email }}</td>
            <td><span class="role-badge" :class="u.role === 'ROLE_ADMIN' ? 'is-admin' : ''">{{ u.role }}</span></td>
            <td>
              <router-link :to="`/admin/users/edit/${u.username}`" class="btn btn-sm cs-btn-ghost me-1">Sửa</router-link>
              <button class="btn btn-sm cs-btn-danger" @click="remove(u.username)">Xóa</button>
            </td>
          </tr>
          <tr v-if="users.length === 0"><td colspan="5" class="empty-cell">Chưa có người dùng nào.</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
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
<style scoped>.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.cs-card{box-shadow:0 10px 30px rgba(31,41,55,.08)}.cs-table{color:#374151}.cs-table thead th{color:#6b7280;background:#f9fafb}.cs-table tbody tr:hover{background:#fffafa}.role-badge{display:inline-block;padding:.3rem .55rem;border-radius:999px;background:#e0f2fe;color:#075985;font-size:.72rem;font-weight:700}.role-badge.is-admin{background:#fee2e2;color:#991b1b}.empty-cell{text-align:center;color:#6b7280;padding:2.5rem!important}@media(max-width:575.98px){.container>div:first-child{align-items:flex-start!important;gap:1rem;flex-direction:column}.container>div:first-child .btn{width:100%}}</style>
