<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">Hồ sơ cá nhân</h2>
      <div v-if="profile">
        <form class="vstack gap-3" @submit.prevent="updateProfile">
          <div><label class="form-label">Username</label><input :value="profile.username" class="form-control" disabled /></div>
          <div><label class="form-label">Họ tên</label><input v-model="profile.fullname" class="form-control" /></div>
          <div><label class="form-label">Email</label><input v-model="profile.email" class="form-control" /></div>
          <div v-if="msg" class="alert alert-success">{{ msg }}</div>
          <button class="btn cs-btn cs-btn-primary">Cập nhật</button>
        </form>
        <hr class="my-4" />
        <h5>Đổi mật khẩu</h5>
        <form class="vstack gap-3 mt-3" @submit.prevent="changePassword">
          <input v-model="pwd.oldPassword" type="password" class="form-control" placeholder="Mật khẩu cũ" />
          <input v-model="pwd.newPassword" type="password" class="form-control" placeholder="Mật khẩu mới" />
          <input v-model="pwd.confirmPassword" type="password" class="form-control" placeholder="Xác nhận mật khẩu" />
          <div v-if="pwdMsg" class="alert" :class="pwdOk ? 'alert-success' : 'alert-danger'">{{ pwdMsg }}</div>
          <button class="btn cs-btn cs-btn-warning">Đổi mật khẩu</button>
        </form>
      </div>
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
