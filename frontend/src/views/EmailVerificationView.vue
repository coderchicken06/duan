<template>
  <div class="container cs-container py-5">
    <div class="verification-card cs-card p-4">
      <span class="eyebrow">XÁC THỰC EMAIL</span>
      <h2 class="cs-page-title mt-2 mb-2">Kích hoạt tài khoản</h2>
      <p class="text-secondary">
        Nhập mã gồm 6 chữ số đã gửi đến
        <strong v-if="email">{{ email }}</strong>
        <span v-else>email đăng ký của bạn</span>.
      </p>

      <form class="vstack gap-3 mt-4" @submit.prevent="verify">
        <div v-if="message" class="alert" :class="success ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>
        <div>
          <label class="form-label">Tên đăng nhập</label>
          <input v-model.trim="username" class="form-control" required autocomplete="username">
        </div>
        <div>
          <label class="form-label">Mã xác thực</label>
          <input v-model.trim="code" class="form-control code-input" required inputmode="numeric"
            autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="Nhập mã OTP">
        </div>
        <button class="btn cs-btn cs-btn-primary w-100" :disabled="loading">
          {{ loading ? 'Đang xác thực...' : 'Xác thực email' }}
        </button>
        <button type="button" class="btn cs-btn cs-btn-ghost w-100" :disabled="resending" @click="resend">
          {{ resending ? 'Đang gửi...' : 'Gửi lại mã xác thực' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authApi } from '../api'

const route = useRoute()
const router = useRouter()
const username = ref(String(route.query.username || ''))
const email = String(route.query.email || '')
const code = ref('')
const message = ref('')
const success = ref(false)
const loading = ref(false)
const resending = ref(false)

async function verify() {
  loading.value = true
  message.value = ''
  try {
    const { data } = await authApi.verifyEmail(username.value, code.value)
    success.value = data.success
    message.value = data.message
    if (data.success) {
      setTimeout(() => router.push({ path: '/login', query: { verified: '1' } }), 1200)
    }
  } catch (error) {
    success.value = false
    message.value = error.response?.data?.message || 'Không thể xác thực email.'
  } finally {
    loading.value = false
  }
}

async function resend() {
  resending.value = true
  message.value = ''
  try {
    const { data } = await authApi.resendVerification(username.value)
    success.value = data.success
    message.value = data.message
  } catch (error) {
    success.value = false
    message.value = error.response?.data?.message || 'Không thể gửi lại mã xác thực.'
  } finally {
    resending.value = false
  }
}
</script>

<style scoped>
.verification-card {
  max-width: 560px;
  margin: auto;
  box-shadow: 0 16px 40px rgba(31, 41, 55, .1)
}

.eyebrow {
  color: #dc2626;
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .08em
}

.form-label {
  font-weight: 600;
  color: #374151
}

.form-control {
  min-height: 48px;
  background: #fff;
  color: #111827;
  border-color: #d1d5db
}

.code-input {
  text-align: center;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: .25em
}

.cs-btn {
  min-height: 44px;
  font-weight: 600
}
</style>
