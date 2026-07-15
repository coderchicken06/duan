<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">{{ isEdit ? 'Sửa user' : 'Thêm user' }}</h2>
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
        <button class="btn cs-btn cs-btn-primary" type="submit">Lưu</button>
      </form>
    </div>
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
    ? await adminApi.updateUser(route.params.username, form.value)
    : await adminApi.createUser(form.value)
  if (res.data.success === false) {
    error.value = res.data.message
    return
  }
  router.push('/admin/users')
}
</script>
