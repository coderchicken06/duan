<template>
  <div class="container cs-container py-5">
    <div class="cs-card profile-card overflow-hidden"><div class="profile-header p-4"><div class="avatar">{{ profile?.fullname?.charAt(0) || profile?.username?.charAt(0) || 'U' }}</div><div><h2 class="cs-page-title mb-1">Hồ sơ cá nhân</h2><p class="mb-0 text-secondary">Quản lý thông tin và bảo mật tài khoản</p></div></div><div class="p-4">
      <div v-if="profile">
        <form class="vstack gap-3" @submit.prevent="updateProfile">
          <div><label class="form-label">Username</label><input :value="profile.username" class="form-control" disabled /></div>
          <div><label class="form-label">Họ tên</label><input v-model="profile.fullname" class="form-control" /></div>
          <div><label class="form-label">Email</label><input v-model="profile.email" class="form-control" /></div>
          <div v-if="msg" class="alert alert-success">{{ msg }}</div>
          <button class="btn cs-btn cs-btn-primary">Cập nhật</button>
        </form>
        <hr class="my-4" />
        <h5 class="fw-bold">Đổi mật khẩu</h5>
        <form class="vstack gap-3 mt-3" @submit.prevent="changePassword">
          <input v-model="pwd.oldPassword" type="password" class="form-control" placeholder="Mật khẩu cũ" />
          <input v-model="pwd.newPassword" type="password" class="form-control" placeholder="Mật khẩu mới" />
          <input v-model="pwd.confirmPassword" type="password" class="form-control" placeholder="Xác nhận mật khẩu" />
          <div v-if="pwdMsg" class="alert" :class="pwdOk ? 'alert-success' : 'alert-danger'">{{ pwdMsg }}</div>
          <button class="btn cs-btn cs-btn-warning">Đổi mật khẩu</button>
        </form>
      </div></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { profileApi } from '../api'

const profile = ref(null)
const msg = ref('')
const pwd = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })
const pwdMsg = ref('')
const pwdOk = ref(false)

onMounted(async () => {
  const { data } = await profileApi.get()
  if (data.success) profile.value = { ...data }
})

async function updateProfile() {
  const { data } = await profileApi.update(profile.value)
  msg.value = data.message || 'Cập nhật thành công'
}

async function changePassword() {
  const { data } = await profileApi.changePassword(pwd.value)
  pwdOk.value = data.success !== false
  pwdMsg.value = data.message
}
</script>
<style scoped>.profile-card{max-width:820px;margin:auto}.profile-header{display:flex;align-items:center;gap:1rem;background:#fffafa;border-bottom:1px solid #fee2e2}.avatar{width:64px;height:64px;flex:0 0 64px;display:grid;place-items:center;border-radius:50%;background:#dc2626;color:#fff;font-size:1.5rem;font-weight:800;text-transform:uppercase}.form-label{font-weight:600;color:#374151}.form-control{min-height:46px;background:#fff;color:#111827;border-color:#d1d5db}.form-control:disabled{background:#f3f4f6;color:#6b7280}.cs-btn{min-height:44px;font-weight:600}@media(max-width:575.98px){.profile-header{align-items:flex-start}.avatar{width:52px;height:52px;flex-basis:52px}}</style>
