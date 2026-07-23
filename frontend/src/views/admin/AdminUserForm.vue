<template>
  <div class="container cs-container py-5">
    <div class="cs-card user-form-card overflow-hidden"><div class="form-header p-4"><span class="admin-eyebrow">NGƯỜI DÙNG</span><h2 class="cs-page-title mt-1 mb-0">{{ isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng' }}</h2></div><div class="p-4">
      <form class="vstack gap-3" @submit.prevent="submit">
        <div><label class="form-label">Username</label><input v-model="form.username" class="form-control" :disabled="isEdit" required /></div>
        <div><label class="form-label">Họ tên</label><input v-model="form.fullname" class="form-control" /></div>
        <div><label class="form-label">Email</label><input v-model="form.email" type="email" class="form-control" /></div>
        <div><label class="form-label">Password</label><input v-model="form.password" type="password" class="form-control" :required="!isEdit" /></div>
        <div>
          <label class="form-label">Role</label>
          <select v-model="form.role" class="form-select">
            <option value="ROLE_USER">USER</option>
            <option value="ROLE_ADMIN">ADMIN</option>
          </select>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="d-flex gap-2"><router-link class="btn cs-btn cs-btn-ghost flex-grow-1" to="/admin/users">Hủy</router-link><button class="btn cs-btn cs-btn-primary flex-grow-1" type="submit">Lưu thông tin</button></div>
      </form>
    </div></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminApi } from '../../api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.username)
const error = ref('')
const form = ref({ username: '', fullname: '', email: '', password: '', role: 'ROLE_USER' })

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await adminApi.getUsers()
    const users = Array.isArray(data) ? data : data.data || []
    const u = users.find((x) => x.username === route.params.username)
    if (u) form.value = { ...u, password: '' }
  }
})

async function submit() {
  error.value = ''
  const res = isEdit.value
    ? await adminApi.updateUser(String(route.params.username), form.value)
    : await adminApi.createUser(form.value)
  if (res.data.success === false) {
    error.value = res.data.message
    return
  }
  router.push('/admin/users')
}
</script>
<style scoped>.user-form-card{max-width:760px;margin:auto}.form-header{background:#fffafa;border-bottom:1px solid #fee2e2}.admin-eyebrow{font-size:.72rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.form-label{font-weight:600;color:#374151}.form-control,.form-select{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}.form-control:disabled{background:#f3f4f6;color:#6b7280}.cs-btn{min-height:44px;font-weight:600}</style>
