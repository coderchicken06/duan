<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">Gửi yêu cầu đặt xe</h2>
      <form class="vstack gap-3" @submit.prevent="submit">
        <div>
          <label class="form-label cs-muted">Địa chỉ giao hàng</label>
          <textarea v-model="address" class="form-control" rows="3" required placeholder="Nhập địa chỉ nhận xe"></textarea>
        </div>
        <p>Tổng giá trị xe: <strong class="text-danger">{{ formatPrice(total) }} VNĐ</strong></p>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="success" class="alert alert-success">Gửi yêu cầu đặt xe thành công! Mã đơn: #{{ orderId }}</div>
        <button type="submit" class="btn cs-btn cs-btn-primary" :disabled="submitting">Xác nhận gửi yêu cầu</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
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
