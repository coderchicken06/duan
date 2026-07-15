<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">
          <h2 class="cs-page-title mb-4">Xác nhận OTP</h2>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Mã OTP</label><input v-model="otp" class="form-control" required /></div>
            <button class="btn cs-btn cs-btn-primary" type="submit">Xác nhận</button>
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
