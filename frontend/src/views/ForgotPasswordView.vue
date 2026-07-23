<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4 auth-card">
          <div class="step-icon mb-3">?</div><h2 class="cs-page-title mb-2">Quên mật khẩu</h2><p class="text-secondary mb-4">Nhập email đã đăng ký, chúng tôi sẽ gửi mã OTP xác thực.</p>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Email đăng ký</label><input v-model="email" type="email" class="form-control" required placeholder="vidu@email.com" autocomplete="email" /></div>
            <button class="btn cs-btn cs-btn-primary w-100" type="submit">Gửi mã OTP</button>
            <router-link class="text-center fw-semibold" to="/login">← Quay lại đăng nhập</router-link>
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
<style scoped>.auth-card{max-width:560px;margin:auto;box-shadow:0 16px 40px rgba(31,41,55,.1)}.step-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:#fee2e2;color:#dc2626;font-size:1.25rem;font-weight:800}.form-label{font-weight:600;color:#374151}.form-control{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}.cs-btn{min-height:44px;font-weight:600}</style>
