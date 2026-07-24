<template>
  <main class="service-page">
    <section class="ford-hero-panel compact content-only service-hero">
      <div class="ford-hero-panel-content">
        <span class="service-eyebrow">DỊCH VỤ CARSTORE</span>
        <h1>Chăm sóc xe thuận tiện, rõ ràng</h1>
        <p>Đặt lịch nhanh với thông tin cần thiết. Nhân viên CarStore sẽ liên hệ xác nhận lịch hẹn.</p>
      </div>
    </section>

    <div class="container cs-container py-5">
      <section class="service-grid" aria-label="Các dịch vụ">
        <article v-for="service in services" :key="service.title" class="cs-card service-card">
          <span class="service-icon">{{ service.icon }}</span>
          <div>
            <h2>{{ service.title }}</h2>
            <p>{{ service.desc }}</p>
          </div>
        </article>
      </section>

      <section class="cs-card booking-card">
        <div class="booking-intro">
          <span class="service-eyebrow">ĐẶT LỊCH</span>
          <h2>Thông tin lịch hẹn</h2>
          <p>Điền thông tin bên cạnh. Các trường có dấu <strong>*</strong> là bắt buộc.</p>
          <div class="booking-note">
            <strong>Quy trình đơn giản</strong>
            <span>1. Gửi yêu cầu</span>
            <span>2. Nhân viên xác nhận</span>
            <span>3. Mang xe đến đúng lịch</span>
          </div>
        </div>

        <form class="booking-form" novalidate @submit.prevent="submit">
          <div class="field">
            <label for="service-name">Họ tên *</label>
            <input id="service-name" v-model.trim="form.name" class="form-control" maxlength="255" autocomplete="name" />
          </div>
          <div class="field">
            <label for="service-phone">Số điện thoại *</label>
            <input id="service-phone" v-model.trim="form.phone" class="form-control" inputmode="tel" maxlength="12" autocomplete="tel" placeholder="+84xxxxxxxxx" />
          </div>
          <div class="field">
            <label for="service-car">Thông tin xe / biển số *</label>
            <input id="service-car" v-model.trim="form.carInfo" class="form-control" :readonly="form.carId != null" maxlength="255" placeholder="Tên xe hoặc biển số" />
            <small v-if="form.carId">Xe được chọn từ trang chi tiết sản phẩm.</small>
          </div>
          <div class="field">
            <label for="service-type">Loại dịch vụ *</label>
            <select id="service-type" v-model="form.serviceType" class="form-select">
              <option value="">-- Chọn dịch vụ --</option>
              <option>Bảo dưỡng định kỳ</option>
              <option>Sửa chữa</option>
              <option>Bảo hành</option>
              <option>Kiểm tra tổng thể</option>
            </select>
          </div>
          <div class="field">
            <label for="service-date">Ngày hẹn *</label>
            <input id="service-date" v-model="form.appointmentDate" :min="today" type="date" class="form-control" />
          </div>
          <div class="field">
            <label for="service-time">Giờ hẹn *</label>
            <input
              id="service-time"
              v-model="form.appointmentTime"
              :min="minimumAppointmentTime"
              type="time"
              class="form-control"
            />
            <small v-if="form.appointmentDate === today">Vui lòng chọn giờ sau thời điểm hiện tại.</small>
          </div>

          <div class="booking-actions">
            <div v-if="msg" class="alert mb-0" :class="ok ? 'alert-success' : 'alert-danger'" role="alert">{{ msg }}</div>
            <button class="btn cs-btn cs-btn-primary" type="submit" :disabled="submitting">
              {{ submitting ? 'Đang gửi yêu cầu...' : 'Xác nhận đặt lịch' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, supportApi } from '../api'

const route = useRoute()
const toLocalDate = (value) => {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const today = toLocalDate(new Date())
const services = [
  { icon: '🔧', title: 'Bảo dưỡng định kỳ', desc: 'Kiểm tra và bảo dưỡng xe theo tiêu chuẩn hãng.' },
  { icon: '🛞', title: 'Lốp và phụ tùng', desc: 'Kiểm tra lốp, dầu nhớt và phụ tùng cần thay thế.' },
  { icon: '📋', title: 'Kiểm tra tổng thể', desc: 'Kiểm tra tình trạng xe trước những hành trình dài.' },
]

const form = ref({
  name: '',
  phone: '',
  type: 'service',
  content: 'Yêu cầu đặt lịch dịch vụ',
  carId: null,
  carInfo: '',
  serviceType: '',
  appointmentDate: '',
  appointmentTime: '',
})
const msg = ref('')
const ok = ref(false)
const submitting = ref(false)
const minimumAppointmentTime = computed(() => {
  if (form.value.appointmentDate !== today) return undefined
  const nextMinute = new Date(Date.now() + 60_000)
  return `${String(nextMinute.getHours()).padStart(2, '0')}:${String(nextMinute.getMinutes()).padStart(2, '0')}`
})

onMounted(async () => {
  if (!route.query.carId) return
  try {
    const { data } = await carApi.getById(String(route.query.carId))
    if (!data.success || !data.data) throw new Error(data.message || 'Không tìm thấy xe')
    form.value.carId = data.data.id
    form.value.carInfo = data.data.name
    form.value.serviceType = 'Kiểm tra tổng thể'
  } catch (error) {
    ok.value = false
    msg.value = error.response?.data?.message || error.message || 'Không tìm thấy xe cần đặt lịch'
  }
})

function validateForm() {
  if (!form.value.name || !form.value.phone || !form.value.carInfo || !form.value.serviceType
      || !form.value.appointmentDate || !form.value.appointmentTime) {
    return 'Vui lòng điền đầy đủ các trường bắt buộc.'
  }
  if (!/^\+84[0-9]{9}$/.test(form.value.phone.replace(/\s+/g, ''))) {
    return 'Số điện thoại phải có định dạng +84xxxxxxxxx.'
  }
  const appointment = new Date(`${form.value.appointmentDate}T${form.value.appointmentTime}`)
  if (Number.isNaN(appointment.getTime()) || appointment.getTime() <= Date.now()) {
    return 'Thời gian hẹn phải sau thời điểm hiện tại.'
  }
  return ''
}

async function submit() {
  msg.value = validateForm()
  ok.value = false
  if (msg.value) return

  submitting.value = true
  try {
    const { data } = await supportApi.create(form.value)
    ok.value = data.success
    msg.value = data.message || 'Không thể đặt lịch'
    if (data.success) {
      form.value.appointmentDate = ''
      form.value.appointmentTime = ''
      if (form.value.carId == null) {
        form.value.carInfo = ''
        form.value.serviceType = ''
      }
    }
  } catch (error) {
    ok.value = false
    msg.value = error.response?.data?.message || 'Không thể đặt lịch dịch vụ'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.service-page{background:#f7f8fa;min-height:70vh}.service-hero{color:#fff;padding:38px}.service-hero h1{font-size:clamp(2rem,4vw,3.2rem);font-weight:800;max-width:720px;margin:8px 0 12px}.service-hero p{color:#d1d5db;font-size:1.05rem;max-width:650px;margin:0}.service-eyebrow{color:#ef4444;font-size:.76rem;font-weight:800;letter-spacing:.14em}.service-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:-78px;margin-bottom:32px}.service-card{display:flex;gap:16px;padding:24px;box-shadow:0 14px 35px rgba(17,24,39,.08)}.service-icon{display:grid;place-items:center;background:#fef2f2;border-radius:14px;font-size:1.7rem;height:52px;min-width:52px}.service-card h2{font-size:1.05rem;font-weight:800;margin:2px 0 8px}.service-card p{color:#6b7280;font-size:.92rem;margin:0}.booking-card{display:grid;grid-template-columns:300px 1fr;overflow:hidden}.booking-intro{background:#182333;color:#fff;padding:34px}.booking-intro h2{font-weight:800;margin:8px 0 12px}.booking-intro p{color:#cbd5e1}.booking-note{border-top:1px solid #425064;display:grid;gap:9px;margin-top:28px;padding-top:22px}.booking-note span{color:#cbd5e1;font-size:.9rem}.booking-form{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:34px}.field{display:grid;gap:7px}.field label{font-size:.88rem;font-weight:700}.field small{color:#6b7280}.booking-actions{display:flex;align-items:center;justify-content:space-between;gap:16px;grid-column:1/-1;margin-top:4px}.booking-actions .alert{flex:1}.booking-actions .btn{min-width:210px}@media(max-width:850px){.service-grid{grid-template-columns:1fr;margin-top:24px}.booking-card{grid-template-columns:1fr}.booking-intro{padding:26px}}@media(max-width:600px){.booking-form{grid-template-columns:1fr;padding:24px}.booking-actions{align-items:stretch;flex-direction:column}.booking-actions .btn{width:100%}}
.service-hero{background:linear-gradient(120deg,#111827,#293547);padding:58px 0}
.service-hero{padding:28px}.service-hero .ford-hero-panel-content{max-width:760px}
</style>
