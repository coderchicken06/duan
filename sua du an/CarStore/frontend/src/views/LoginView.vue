<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="cs-card">
          <div class="cs-card-header p-4">
            <div class="cs-badge mb-3">🔐 Authentication</div>
            <h2 class="cs-page-title mb-1">Đăng nhập</h2>
            <div class="cs-muted">Đăng nhập để truy cập chức năng theo quyền.</div>
          </div>
          <div class="p-4">
            <form class="vstack gap-3" @submit.prevent="submit">
              <div v-if="error" class="alert alert-danger">{{ error }}</div>
              <div v-if="registered" class="alert alert-success">Đăng ký thành công. Vui lòng đăng nhập.</div>
              <div v-if="resetSuccess" class="alert alert-success">Đổi mật khẩu thành công. Vui lòng đăng nhập.</div>
              <div>
                <label class="form-label cs-muted">Username</label>
                <input v-model="username" class="form-control" required />
              </div>
              <div>
                <label class="form-label cs-muted">Password</label>
                <input v-model="password" type="password" class="form-control" required />
              </div>
              <router-link to="/forgot-password">Quên mật khẩu?</router-link>
              <button class="btn cs-btn cs-btn-primary w-100" type="submit" :disabled="loading">Login</button>
              <router-link class="btn cs-btn cs-btn-ghost w-100" to="/">Về trang chủ</router-link>
              <div class="text-center mt-3">
                <p class="mb-2">Hoặc đăng nhập nhanh bằng</p>
                <a class="btn btn-outline-danger w-100" href="/oauth2/authorization/google">Đăng nhập bằng Google</a>
              </div>
              <div class="text-center mt-4">
                <span>Chưa có tài khoản? </span>
                <router-link to="/signup" class="fw-bold">Tạo tài khoản</router-link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const registered = ref(route.query.registered === '1')
const resetSuccess = ref(route.query.resetSuccess === '1')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const data = await auth.login(username.value, password.value)
    if (data.success) {
      router.push(route.query.redirect || '/')
    } else {
      error.value = data.message || 'Đăng nhập không thành công'
    }
  } finally {
    loading.value = false
  }
}
</script>
