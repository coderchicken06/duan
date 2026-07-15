<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="cs-card p-4">
          <h2 class="cs-page-title mb-4">Đăng ký tài khoản</h2>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Username</label><input v-model="form.username" class="form-control" required /></div>
            <div><label class="form-label">Họ tên</label><input v-model="form.fullname" class="form-control" /></div>
            <div><label class="form-label">Email</label><input v-model="form.email" type="email" class="form-control" required /></div>
            <div><label class="form-label">Password</label><input v-model="form.password" type="password" class="form-control" required minlength="6" /></div>
            <button class="btn cs-btn cs-btn-primary" type="submit" :disabled="loading">Đăng ký</button>
            <router-link to="/login">Đã có tài khoản? Đăng nhập</router-link>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = ref({ username: '', fullname: '', email: '', password: '' })

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await authApi.signup(form.value)
    if (data.success) {
      router.push({ path: '/login', query: { registered: '1' } })
    } else {
      error.value = data.message
    }
  } finally {
    loading.value = false
  }
}
</script>
