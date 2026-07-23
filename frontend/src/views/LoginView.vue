<template>
  <div class="auth-page py-5">
  <div class="container cs-container">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="cs-card">
          <div class="cs-card-header p-4">
            <div class="auth-icon mb-3">ĐN</div>
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
                <input v-model="username" class="form-control" required placeholder="Nhập tên đăng nhập" autocomplete="username" />
              </div>
              <div>
                <label class="form-label cs-muted">Password</label>
                <div class="input-group"><input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control" required placeholder="Nhập mật khẩu" autocomplete="current-password" /><button class="btn password-toggle" type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Ẩn' : 'Hiện' }}</button></div>
              </div>
              <router-link to="/forgot-password">Quên mật khẩu?</router-link>
              <button class="btn cs-btn cs-btn-primary w-100" type="submit" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</button>
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
        </div><p class="auth-footer text-center mt-3 mb-0">CarStore · Đồng hành cùng mọi hành trình</p>
      </div>
    </div>
  </div></div>
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
const showPassword = ref(false)
const registered = ref(route.query.registered === '1')
const resetSuccess = ref(route.query.resetSuccess === '1')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const data = await auth.login(username.value, password.value)
    if (data.success) {
      router.push(String(route.query.redirect || '/'))
    } else {
      error.value = data.message || 'Đăng nhập không thành công'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page{min-height:calc(100vh - 140px);background:linear-gradient(180deg,#fff7f7 0,#fff 70%)}
.cs-card{overflow:hidden;box-shadow:0 16px 40px rgba(31,41,55,.1)}
.cs-card-header{background:#fffafa}.auth-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:12px;background:#dc2626;color:#fff;font-weight:800}
.form-label{font-weight:600;color:#374151}.form-control{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}
.password-toggle{border:1px solid #d1d5db;background:#f9fafb;color:#4b5563}.cs-btn{min-height:44px;font-weight:600}
.auth-footer{font-size:.875rem;color:#6b7280}@media(max-width:575.98px){.auth-page{padding-top:1.5rem!important}.cs-card-header,.cs-card>div{padding:1.25rem!important}}
</style>
