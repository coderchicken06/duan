<template>
  <div class="container py-5">
    <h1 class="fw-bold mb-4">Dịch vụ hậu mãi</h1>
    <div class="row g-4 mb-5">
      <div class="col-md-4" v-for="s in services" :key="s.title">
        <div class="cs-card p-4 h-100"><h4>{{ s.icon }} {{ s.title }}</h4><p class="cs-muted">{{ s.desc }}</p></div>
      </div>
    </div>
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">Đặt lịch dịch vụ</h2>
      <form class="row g-3" @submit.prevent="submit">
        <div class="col-md-6"><label class="form-label">Họ tên</label><input v-model="form.name" class="form-control" required /></div>
        <div class="col-md-6"><label class="form-label">Số điện thoại</label><input v-model="form.phone" class="form-control" pattern="[0-9]{9,11}" required /></div>
        <div class="col-md-6"><label class="form-label">Thông tin xe / biển số</label><input v-model="form.carInfo" class="form-control" required /></div>
        <div class="col-md-6"><label class="form-label">Loại dịch vụ</label><select v-model="form.serviceType" class="form-select" required><option value="">-- Chọn dịch vụ --</option><option>Bảo dưỡng định kỳ</option><option>Sửa chữa</option><option>Bảo hành</option><option>Kiểm tra tổng thể</option></select></div>
        <div class="col-md-6"><label class="form-label">Ngày hẹn</label><input v-model="form.appointmentDate" :min="today" type="date" class="form-control" required /></div>
        <div class="col-md-6"><label class="form-label">Giờ hẹn</label><input v-model="form.appointmentTime" type="time" class="form-control" required /></div>
        <div class="col-12"><div v-if="msg" class="alert" :class="ok ? 'alert-success' : 'alert-danger'">{{ msg }}</div><button class="btn cs-btn cs-btn-primary" type="submit">Xác nhận đặt lịch</button></div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { supportApi } from '../api'
const today = new Date().toISOString().slice(0, 10)
const services = [
  { icon: '🔧', title: 'Bảo dưỡng định kỳ', desc: 'Kiểm tra và bảo dưỡng xe theo tiêu chuẩn hãng.' },
  { icon: '🛞', title: 'Thay lốp & phụ tùng', desc: 'Lốp xe, dầu nhớt và phụ tùng chính hãng.' },
  { icon: '📋', title: 'Kiểm tra tổng thể', desc: 'Kiểm tra an toàn toàn diện trước mỗi hành trình.' },
]
const form = ref({ name:'', phone:'', type:'service', content:'Yêu cầu đặt lịch dịch vụ', carInfo:'', serviceType:'', appointmentDate:'', appointmentTime:'' })
const msg = ref(''); const ok = ref(false)
async function submit() {
  try { const { data } = await supportApi.create(form.value); ok.value = data.success; msg.value = data.message || 'Không thể đặt lịch'; if (data.success) form.value = { ...form.value, carInfo:'', serviceType:'', appointmentDate:'', appointmentTime:'' } }
  catch (e) { ok.value = false; msg.value = e.response?.data?.message || 'Không thể đặt lịch dịch vụ' }
}
</script>
