<template>
  <div class="container cs-container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">
        <div class="cs-card overflow-hidden"><div class="form-header p-4 pb-3"><span class="eyebrow">THÀNH VIÊN MỚI</span><h2 class="cs-page-title mt-2 mb-1">Đăng ký tài khoản</h2><p class="text-secondary mb-0">Tạo tài khoản để đặt xe và theo dõi đơn hàng.</p></div><div class="p-4 pt-3">
          <form class="vstack gap-3" @submit.prevent="submit">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <div><label class="form-label">Tên đăng nhập</label><input v-model="form.username" class="form-control" required placeholder="Nhập tên đăng nhập" autocomplete="username" /></div>
            <div><label class="form-label">Họ tên</label><input v-model="form.fullname" class="form-control" placeholder="Nhập họ và tên" autocomplete="name" /></div>
            <div><label class="form-label">Email</label><input v-model="form.email" type="email" class="form-control" required placeholder="vidu@email.com" autocomplete="email" /></div>
            <div><label class="form-label">Mật khẩu</label><div class="input-group"><input v-model="form.password" :type="showPassword ? 'text' : 'password'" class="form-control" required minlength="6" placeholder="Tối thiểu 6 ký tự" autocomplete="new-password" /><button class="btn password-toggle" type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Ẩn' : 'Hiện' }}</button></div></div>
            <button class="btn cs-btn cs-btn-primary w-100" type="submit" :disabled="loading"><span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>{{ loading ? 'Đang tạo tài khoản...' : 'Đăng ký' }}</button>
            <div class="text-center text-secondary">Đã có tài khoản? <router-link to="/login" class="fw-semibold">Đăng nhập</router-link></div>
          </form>
        </div></div>
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
const showPassword = ref(false)
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

<style scoped>
.cs-card{box-shadow:0 16px 40px rgba(31,41,55,.1)}.form-header{background:#fffafa;border-bottom:1px solid #fee2e2}.eyebrow{color:#dc2626;font-size:.75rem;font-weight:800;letter-spacing:.08em}.form-label{font-weight:600;color:#374151}.form-control{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}.password-toggle{border:1px solid #d1d5db;background:#f9fafb;color:#4b5563}.cs-btn{min-height:44px;font-weight:600}
</style>
