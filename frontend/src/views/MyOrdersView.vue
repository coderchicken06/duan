<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Đơn hàng của tôi</h2>
    <div class="table-responsive cs-card p-3">
      <table class="table cs-table mb-0">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Ngày đặt</th>
            <th>Thời gian thanh toán cọc</th>
            <th>Địa chỉ</th>
            <th>Trạng thái</th>
            <th>Tiền cọc</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in orders" :key="o.id">
            <td>
              <div class="product-cell">
                <img v-if="o.carImage" :src="carImageUrl(o.carImage)" :alt="o.carName || o.productName" @error="useDefaultCarImage" />
                <span>{{ o.carName || o.productName }}</span>
              </div>
            </td>
            <td>{{ formatDate(o.createDate) }}</td>
            <td>{{ formatDepositPaidAt(o) }}</td>
            <td>{{ o.address }}</td>
            <td><span class="badge bg-secondary">{{ o.status }}</span></td>
            <td>{{ o.depositAmount != null ? `${formatPrice(o.depositAmount)} VNĐ` : 'Chưa xác định' }}</td>
            <td>
              <router-link :to="`/order/detail/${o.id}`">Chi tiết</router-link>
              <span v-if="isCompleted(o) && isOrderReviewed(o)" class="badge bg-secondary ms-2">Đã đánh giá</span>
              <button v-else-if="isCompleted(o)" class="btn btn-danger btn-sm ms-2" type="button" @click="openReview(o)">
                Đánh giá xe
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="orders.length === 0" class="text-center cs-muted py-4">Chưa có đơn hàng nào.</p>
    </div>
    <div v-if="reviewOrder" class="modal-backdrop" @click.self="closeReview">
      <section class="review-modal cs-card" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 id="review-title" class="mb-0">Đánh giá xe</h3>
          <button class="btn-close" type="button" aria-label="Đóng" @click="closeReview"></button>
        </div>
        <div v-if="reviewCars.length > 1" class="mb-3">
          <label class="form-label" for="review-car">Xe</label>
          <select id="review-car" v-model="reviewCarId" class="form-select">
            <option v-for="item in reviewCars" :key="item.car?.id" :value="item.car?.id">{{ item.car?.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <span id="review-rating-label" class="form-label d-block">Mức độ hài lòng:</span>
          <div class="rating-stars" role="radiogroup" aria-labelledby="review-rating-label" @mouseleave="hoverRating = 0">
            <button v-for="star in 5" :key="star" type="button" class="rating-star" role="radio"
              :aria-checked="rating === star" :aria-label="`${star} sao`"
              @mouseenter="hoverRating = star" @focus="hoverRating = star" @blur="hoverRating = 0"
              @click="rating = star">
              <svg viewBox="0 0 24 24" aria-hidden="true" :class="{ active: star <= (hoverRating || rating) }">
                <path d="M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.56L12 17.54l-5.88 3.08 1.12-6.56-4.76-4.64 6.58-.96L12 2.5z" />
              </svg>
            </button>
          </div>
          <small class="rating-label">{{ satisfactionLabel }}</small>
        </div>
        <label class="form-label" for="review-comment">Bình luận</label>
        <textarea id="review-comment" v-model.trim="reviewForm.comment" class="form-control" rows="4" maxlength="1000"></textarea>
        <p v-if="reviewError" class="alert alert-danger mt-3 mb-0">{{ reviewError }}</p>
        <div class="d-flex justify-content-end gap-2 mt-3">
          <button class="btn cs-btn cs-btn-ghost" type="button" @click="closeReview">Hủy</button>
          <button class="btn cs-btn cs-btn-primary" type="button" :disabled="reviewSubmitting || rating === 0" @click="submitReview">
            {{ reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { carImageUrl, formatPrice, orderApi, reviewApi, useDefaultCarImage } from '../api'
import api from '../api/client'
import { showCartToast } from '../composables/useCartToast'

const orders = ref([])
const reviewedCarIds = ref([])
const pendingReviewCarIds = ref([])
const orderCarIds = ref({})
const reviewOrder = ref(null)
const reviewCars = ref([])
const reviewCarId = ref(null)
const reviewForm = ref({ comment: '' })
const rating = ref(0)
const hoverRating = ref(0)
const reviewError = ref('')
const reviewSubmitting = ref(false)
const satisfactionLabel = computed(() => ({
  0: 'Vui lòng chọn mức độ hài lòng',
  1: 'Rất không hài lòng',
  2: 'Không hài lòng',
  3: 'Bình thường',
  4: 'Hài lòng',
  5: 'Rất hài lòng',
}[rating.value]))

let pollTimer = null

async function loadOrders() {
  try {
    const [ordersResponse, reviewedResponse] = await Promise.all([
      orderApi.getMyOrders(),
      api.get('/api/reviews/my-reviewed-cars'),
    ])
    const latestOrders = ordersResponse.data.data || []
    orders.value = latestOrders
    reviewedCarIds.value = [...new Set([...(reviewedResponse.data || []), ...pendingReviewCarIds.value])]
    const completedOrders = latestOrders.filter(isCompleted)
    const details = await Promise.all(completedOrders.map(async (order) => {
      const { data } = await orderApi.getDetails(order.id)
      return [order.id, (data.details || []).map((detail) => detail.car?.id).filter(Boolean)]
    }))
    orderCarIds.value = Object.fromEntries(details)
  } catch {
    // Giữ dữ liệu gần nhất nếu một lượt polling tạm thời mất kết nối.
  }
}

onMounted(() => {
  loadOrders()
  pollTimer = window.setInterval(loadOrders, 2000)
})

onBeforeUnmount(() => window.clearInterval(pollTimer))

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString('vi-VN') : ''
}

function formatDepositPaidAt(order) {
  const paymentTime = order.paidAt || order.paymentTime
  if (paymentTime) {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(paymentTime))
  }
  const status = String(order.status || '').toUpperCase()
  const depositStatus = String(order.depositStatus || '').toUpperCase()
  return ['PENDING', 'CANCELLED'].includes(status) && ['UNPAID', 'DEPOSIT_UNPAID', ''].includes(depositStatus)
    ? 'Chưa thanh toán cọc'
    : '--'
}

function isCompleted(order) {
  return ['COMPLETED', 'DELIVERED'].includes(order.status)
}

function isOrderReviewed(order) {
  const carIds = orderCarIds.value[order.id] || []
  return carIds.length > 0 && carIds.every((carId) => reviewedCarIds.value.includes(carId))
}

async function openReview(order) {
  reviewOrder.value = order
  reviewError.value = ''
  reviewForm.value = { comment: '' }
  rating.value = 0
  hoverRating.value = 0
  try {
    const { data } = await orderApi.getDetails(order.id)
    reviewCars.value = (data.details || []).filter((detail) =>
      detail.car?.id && !reviewedCarIds.value.includes(detail.car.id))
    reviewCarId.value = reviewCars.value[0]?.car?.id || null
    if (!reviewCarId.value) {
      reviewError.value = 'Không tìm thấy xe trong đơn hàng này.'
    }
  } catch (error) {
    reviewError.value = error.response?.data?.message || 'Không thể tải thông tin đơn hàng.'
  }
}

function closeReview() {
  reviewOrder.value = null
  reviewCars.value = []
  reviewCarId.value = null
  rating.value = 0
  hoverRating.value = 0
}

async function submitReview() {
  if (!reviewCarId.value || !reviewForm.value.comment || rating.value === 0) {
    reviewError.value = rating.value === 0
      ? 'Vui lòng chọn mức độ hài lòng.'
      : 'Vui lòng chọn xe và nhập nội dung đánh giá.'
    return
  }
  reviewSubmitting.value = true
  reviewError.value = ''
  const carId = reviewCarId.value
  const payload = { ...reviewForm.value, rating: rating.value }
  pendingReviewCarIds.value = [...new Set([...pendingReviewCarIds.value, carId])]
  if (!reviewedCarIds.value.includes(carId)) {
    reviewedCarIds.value = [...reviewedCarIds.value, carId]
  }
  closeReview()
  showCartToast('Cảm ơn bạn đã gửi đánh giá!')
  try {
    await reviewApi.create(carId, payload)
  } catch (error) {
    pendingReviewCarIds.value = pendingReviewCarIds.value.filter((id) => id !== carId)
    reviewedCarIds.value = reviewedCarIds.value.filter((id) => id !== carId)
    reviewError.value = error.response?.data?.message || 'Không thể gửi đánh giá.'
    showCartToast(reviewError.value, 'error')
  } finally {
    pendingReviewCarIds.value = pendingReviewCarIds.value.filter((id) => id !== carId)
    reviewSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop { align-items: center; background: rgb(0 0 0 / 45%); display: flex; inset: 0; justify-content: center; padding: 1rem; position: fixed; z-index: 1050; }
.review-modal { max-width: 540px; padding: 1.5rem; width: 100%; }
.rating-stars { display: flex; gap: .25rem; }
.rating-star { background: transparent; border: 0; cursor: pointer; line-height: 1; padding: .15rem; }
.rating-star svg { display: block; fill: transparent; height: 2rem; stroke: #f59e0b; stroke-width: 2px; transition: fill .15s ease, stroke .15s ease; width: 2rem; }
.rating-star svg.active { fill: #f59e0b; stroke: #f59e0b; }
.rating-label { color: #6b7280; display: block; margin-top: .35rem; }
.rating-star:focus-visible { border-radius: .25rem; outline: 2px solid #1d4ed8; outline-offset: 2px; }
.product-cell { align-items: center; display: flex; gap: .65rem; min-width: 180px; }
.product-cell img { border-radius: 4px; height: 42px; object-fit: cover; width: 64px; }
</style>
