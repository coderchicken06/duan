<template>
  <div class="container cs-container py-5">
    <div class="cs-card checkout-card overflow-hidden"><div class="checkout-header p-4"><span class="checkout-step">XÁC NHẬN ĐƠN</span><h2 class="cs-page-title mt-2 mb-1">Gửi yêu cầu đặt xe</h2><p class="text-secondary mb-0">Kiểm tra thông tin trước khi gửi yêu cầu đến CarStore.</p></div><div class="p-4">
      <form class="vstack gap-3" @submit.prevent="submit">
        <div>
          <label class="form-label cs-muted">Địa chỉ giao hàng</label>
          <textarea v-model="address" class="form-control" rows="3" required placeholder="Nhập địa chỉ nhận xe"></textarea>
        </div>
        <div class="order-total"><span>Tổng giá trị xe</span><strong>{{ formatPrice(total) }} VNĐ</strong></div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">Gửi yêu cầu đặt xe thành công! Mã đơn: #{{ orderId }}</div>
        <button type="submit" class="btn cs-btn cs-btn-primary w-100" :disabled="submitting"><span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>{{ submitting ? 'Đang gửi yêu cầu...' : 'Xác nhận gửi yêu cầu' }}</button>
      </form>
    </div></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cartApi, orderApi, formatPrice } from '../api'

const router = useRouter()
const address = ref('')
const total = ref(0)
const error = ref('')
const success = ref(false)
const orderId = ref(null)
const submitting = ref(false)

onMounted(async () => {
  const { data } = await cartApi.get()
  total.value = data.total || 0
  if (!data.items?.length) router.push('/cart/view')
})

async function submit() {
  submitting.value = true
  error.value = ''
  try {
    const { data } = await orderApi.checkout(address.value)
    if (data.success) {
      success.value = true
      orderId.value = data.orderId
      setTimeout(() => router.push('/order/my-orders'), 2000)
    } else {
      error.value = data.message
    }
  } catch (e) {
    error.value = e.response?.data?.message || 'Lỗi đặt hàng'
  } finally {
    submitting.value = false
  }
}
</script>
<style scoped>.checkout-card{max-width:760px;margin:auto}.checkout-header{background:#fffafa;border-bottom:1px solid #fee2e2}.checkout-step{font-size:.75rem;font-weight:800;letter-spacing:.08em;color:#dc2626}.form-label{font-weight:600;color:#374151}.form-control{background:#fff;color:#111827;border-color:#d1d5db}.order-total{display:flex;justify-content:space-between;align-items:center;padding:1rem;border-radius:12px;background:#f9fafb;border:1px solid #e5e7eb}.order-total strong{color:#dc2626;font-size:1.2rem}.cs-btn{min-height:46px;font-weight:700}@media(max-width:575.98px){.order-total{align-items:flex-start;flex-direction:column;gap:.35rem}}</style>
