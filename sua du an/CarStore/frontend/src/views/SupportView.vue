<template>
  <main class="support-page">
      <header class="ford-hero-panel compact content-only support-heading">
        <div class="ford-hero-panel-content">
          <span class="support-eyebrow">TRUNG TÂM HỖ TRỢ</span>
          <h1>CarStore sẵn sàng tiếp nhận yêu cầu</h1>
          <p>Gửi thông tin ngắn gọn, nhân viên phụ trách sẽ kiểm tra và liên hệ lại với bạn.</p>
        </div>
      </header>

    <div class="container cs-container py-5">
      <section class="support-layout">
        <aside class="support-info">
          <article class="support-info-item">
            <span>01</span>
            <div><h2>Tư vấn mua xe</h2><p>Giải đáp thông tin sản phẩm và lựa chọn xe phù hợp.</p></div>
          </article>
          <article class="support-info-item">
            <span>02</span>
            <div><h2>Bảo hành</h2><p>Tiếp nhận yêu cầu kiểm tra bảo hành hoặc phản hồi dịch vụ.</p></div>
          </article>
          <article class="support-info-item">
            <span>03</span>
            <div><h2>Yêu cầu chung</h2><p>Gửi câu hỏi khác liên quan đến sản phẩm và tài khoản.</p></div>
          </article>
          <div class="support-contact">
            <strong>Cần hỗ trợ?</strong>
            <span>Hotline: 1900 9999</span>
            <span>Email: support@carstore.vn</span>
          </div>
        </aside>

        <div class="cs-card support-form-card">
          <div class="form-heading">
            <h2>Gửi yêu cầu hỗ trợ</h2>
            <p>Các trường có dấu <strong>*</strong> là bắt buộc.</p>
          </div>

          <form class="support-form" novalidate @submit.prevent="submit">
            <div class="field">
              <label for="support-name">Họ tên *</label>
              <input id="support-name" v-model.trim="form.name" class="form-control" maxlength="255" autocomplete="name" />
            </div>
            <div class="field">
              <label for="support-phone">Số điện thoại *</label>
              <input id="support-phone" v-model.trim="form.phone" class="form-control" inputmode="tel" maxlength="12" autocomplete="tel" placeholder="+84xxxxxxxxx" />
            </div>
            <div class="field">
              <label for="support-type">Loại yêu cầu *</label>
              <select id="support-type" v-model="form.type" class="form-select">
                <option value="consulting">Tư vấn mua xe</option>
                <option value="warranty">Bảo hành / phản hồi</option>
                <option value="chat">Yêu cầu chung</option>
              </select>
            </div>
            <div class="field">
              <label for="support-car">Thông tin xe</label>
              <input id="support-car" v-model.trim="form.carInfo" class="form-control" maxlength="255" placeholder="Tên xe hoặc biển số nếu có" />
            </div>
            <div class="field field-full">
              <div class="content-label">
                <label for="support-content">Nội dung *</label>
                <span>{{ form.content.length }}/1000</span>
              </div>
              <textarea id="support-content" v-model.trim="form.content" class="form-control" rows="5" maxlength="1000" placeholder="Mô tả yêu cầu bạn cần CarStore hỗ trợ"></textarea>
            </div>

            <div v-if="msg" class="alert field-full mb-0" :class="ok ? 'alert-success' : 'alert-danger'" role="alert">{{ msg }}</div>

            <div class="form-actions field-full">
              <p>Yêu cầu sẽ được lưu trong lịch sử hỗ trợ của tài khoản.</p>
              <button class="btn cs-btn cs-btn-primary" type="submit" :disabled="submitting">
                {{ submitting ? 'Đang gửi...' : 'Gửi yêu cầu' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supportApi } from '../api'

const form = ref({ name: '', phone: '', type: 'consulting', carInfo: '', content: '' })
const msg = ref('')
const ok = ref(false)
const submitting = ref(false)

function validateForm() {
  if (!form.value.name || !form.value.phone || !form.value.type || !form.value.content) {
    return 'Vui lòng điền đầy đủ các trường bắt buộc.'
  }
  if (!/^\+84[0-9]{9}$/.test(form.value.phone.replace(/\s+/g, ''))) {
    return 'Số điện thoại phải có định dạng +84xxxxxxxxx.'
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
    msg.value = data.message || (data.success ? 'Gửi yêu cầu thành công' : 'Không thể gửi yêu cầu')
    if (data.success) {
      form.value.carInfo = ''
      form.value.content = ''
    }
  } catch (error: any) {
    ok.value = false
    msg.value = error.response?.data?.message || 'Không thể kết nối máy chủ. Vui lòng thử lại.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.support-page{background:linear-gradient(180deg,#f8fafc,#fff);min-height:70vh}.support-heading{max-width:none;margin-top:0;margin-bottom:34px}.support-eyebrow{color:#f87171;font-size:.76rem;font-weight:800;letter-spacing:.14em}.support-heading h1{color:#fff;font-size:clamp(2rem,4vw,3rem);font-weight:800;margin:8px 0 12px}.support-heading p{color:#d1d5db;font-size:1.05rem;margin:0}.support-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:26px;align-items:start}.support-info{display:grid;gap:12px}.support-info-item{display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #e5e7eb}.support-info-item>span{color:#b91c1c;font-size:.78rem;font-weight:800;padding-top:3px}.support-info-item h2{font-size:1rem;font-weight:800;margin:0 0 5px}.support-info-item p{color:#6b7280;font-size:.88rem;margin:0}.support-contact{background:#182333;border-radius:16px;color:#fff;display:grid;gap:6px;margin-top:12px;padding:22px}.support-contact span{color:#cbd5e1;font-size:.9rem}.support-form-card{overflow:hidden}.form-heading{border-bottom:1px solid #e5e7eb;padding:26px 30px}.form-heading h2{font-size:1.35rem;font-weight:800;margin:0 0 5px}.form-heading p{color:#6b7280;margin:0}.support-form{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:30px}.field{display:grid;gap:7px}.field label{font-size:.88rem;font-weight:700}.field-full{grid-column:1/-1}.content-label{display:flex;justify-content:space-between}.content-label span{color:#9ca3af;font-size:.78rem}.form-actions{display:flex;align-items:center;justify-content:space-between;gap:20px}.form-actions p{color:#6b7280;font-size:.86rem;margin:0}.form-actions .btn{min-width:160px}@media(max-width:800px){.support-layout{grid-template-columns:1fr}.support-info{grid-template-columns:repeat(3,1fr)}.support-contact{grid-column:1/-1}}@media(max-width:600px){.support-info,.support-form{grid-template-columns:1fr}.support-form{padding:24px}.form-actions{align-items:stretch;flex-direction:column}.form-actions .btn{width:100%}}
.support-heading{max-width:760px;margin-top:0;margin-bottom:34px}.support-eyebrow{color:#b91c1c}.support-heading h1{color:#111827}.support-heading p{color:#6b7280}
.support-heading{max-width:1280px;margin-top:24px;margin-bottom:0}.support-heading .ford-hero-panel-content{max-width:760px}.support-eyebrow{color:#f87171}.support-heading h1{color:#fff}.support-heading p{color:rgba(255,255,255,.86)}
</style>
