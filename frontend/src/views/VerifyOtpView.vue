<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">
          <div class="step-label mb-3">BƯỚC 2/3</div><h2 class="cs-page-title mb-2">Xác nhận OTP</h2><p class="text-secondary mb-4">Nhập mã xác thực đã được gửi đến email của bạn.</p>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Mã OTP</label><input v-model="otp" class="form-control otp-input" required placeholder="Nhập mã OTP" inputmode="numeric" autocomplete="one-time-code" /></div>
            <button class="btn cs-btn cs-btn-primary w-100" type="submit">Xác nhận mã</button>
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
const otp = ref('')
const error = ref('')

async function submit() {
  error.value = ''
  const { data } = await authApi.verifyOtp(otp.value)
  if (data.success) {
    router.push('/reset-password')
  } else {
    error.value = data.message
  }
}
</script>
<style scoped>.cs-card{max-width:560px;margin:auto;box-shadow:0 16px 40px rgba(31,41,55,.1)}.step-label{display:inline-block;padding:.35rem .65rem;border-radius:999px;background:#fee2e2;color:#dc2626;font-size:.75rem;font-weight:800}.form-label{font-weight:600;color:#374151}.otp-input{min-height:52px;background:#fff;color:#111827;border-color:#d1d5db;text-align:center;font-size:1.2rem;font-weight:700;letter-spacing:.18em}.cs-btn{min-height:44px;font-weight:600}</style>
