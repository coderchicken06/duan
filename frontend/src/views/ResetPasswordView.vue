<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">
          <div class="step-label mb-3">BƯỚC 3/3</div><h2 class="cs-page-title mb-2">Đặt lại mật khẩu</h2><p class="text-secondary mb-4">Tạo mật khẩu mới để bảo vệ tài khoản.</p>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Mật khẩu mới</label><div class="input-group"><input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" required placeholder="Nhập mật khẩu mới" autocomplete="new-password" /><button class="btn password-toggle" type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Ẩn' : 'Hiện' }}</button></div></div>
            <div><label class="form-label">Xác nhận mật khẩu</label><input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" class="form-control" required placeholder="Nhập lại mật khẩu" autocomplete="new-password" /></div>
            <button class="btn cs-btn cs-btn-primary w-100" type="submit">Đổi mật khẩu</button>
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
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const showPassword = ref(false)

async function submit() {
  error.value = ''
  const { data } = await authApi.resetPassword(password.value, confirmPassword.value)
  if (data.success) {
    router.push({ path: '/login', query: { resetSuccess: '1' } })
  } else {
    error.value = data.message
  }
}
</script>
<style scoped>.cs-card{max-width:560px;margin:auto;box-shadow:0 16px 40px rgba(31,41,55,.1)}.step-label{display:inline-block;padding:.35rem .65rem;border-radius:999px;background:#fee2e2;color:#dc2626;font-size:.75rem;font-weight:800}.form-label{font-weight:600;color:#374151}.form-control{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}.password-toggle{border:1px solid #d1d5db;background:#f9fafb;color:#4b5563}.cs-btn{min-height:44px;font-weight:600}</style>
