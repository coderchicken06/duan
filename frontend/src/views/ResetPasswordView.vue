<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-6">
        <div class="cs-card p-4">
          <h2 class="cs-page-title mb-4">Đặt lại mật khẩu</h2>
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Mật khẩu mới</label><input v-model="password" type="password" class="form-control" required /></div>
            <div><label class="form-label">Xác nhận mật khẩu</label><input v-model="confirmPassword" type="password" class="form-control" required /></div>
            <button class="btn cs-btn cs-btn-primary" type="submit">Đổi mật khẩu</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../api'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

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
