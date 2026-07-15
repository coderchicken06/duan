<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">Gửi yêu cầu hỗ trợ</h2>
      <form class="vstack gap-3" @submit.prevent="submit">
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label">Họ tên</label><input v-model="form.name" class="form-control" required /></div>
          <div class="col-md-6"><label class="form-label">Số điện thoại</label><input v-model="form.phone" class="form-control" required /></div>
          <div class="col-md-6">
            <label class="form-label">Loại yêu cầu</label>
            <select v-model="form.type" class="form-select">
              <option value="chat">Chat hỗ trợ</option>
              <option value="service">Đặt lịch dịch vụ</option>
              <option value="warranty">Bảo hành</option>
            </select>
          </div>
          <div class="col-md-6"><label class="form-label">Thông tin xe</label><input v-model="form.carInfo" class="form-control" /></div>
          <div class="col-12"><label class="form-label">Nội dung</label><textarea v-model="form.content" class="form-control" rows="4" required></textarea></div>
        </div>
        <div v-if="msg" class="alert" :class="ok ? 'alert-success' : 'alert-danger'">{{ msg }}</div>
        <button class="btn cs-btn cs-btn-primary" type="submit">Gửi yêu cầu</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supportApi } from '../api'

const form = ref({ name: '', phone: '', type: 'chat', carInfo: '', content: '' })
const msg = ref('')
const ok = ref(false)

async function submit() {
  const { data } = await supportApi.create(form.value)
  ok.value = data.success
  msg.value = data.message || (data.success ? 'Gửi thành công' : 'Lỗi')
  if (data.success) form.value.content = ''
}
</script>
