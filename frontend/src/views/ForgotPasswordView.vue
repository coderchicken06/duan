<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">
          <h2 class="cs-page-title mb-4">Quên mật khẩu</h2>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Email đăng ký</label><input v-model="email" type="email" class="form-control" required /></div>
            <button class="btn cs-btn cs-btn-primary" type="submit">Gửi mã OTP</button>
            <router-link to="/login">Quay lại đăng nhập</router-link>
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
const email = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  const { data } = await authApi.forgotPassword(email.value)
  if (data.success) {
    router.push('/verify-otp')
  } else {
    error.value = data.message
  }
}
</script>
