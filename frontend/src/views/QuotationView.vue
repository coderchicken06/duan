<template>
  <main class="quotation-page py-5">
    <div class="container">
      <div v-if="loading" class="text-center py-5"><span class="spinner-border text-danger"></span></div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <article v-else class="quote-card">
        <header>
          <div><span class="eyebrow">CARSTORE</span>
            <h1>BÁO GIÁ XE</h1>
          </div>
          <div class="text-end"><strong>{{ quote.quotationNo || `BG-${quote.id}` }}</strong><small>{{
            formatDate(quote.quotationDate) }}</small></div>
        </header>
        <section>
          <h2>Khách hàng</h2>
          <p><span>Tài khoản</span><strong>{{ quote.customerUsername }}</strong></p>
        </section>
        <section>
          <h2>Thông tin xe</h2>
          <div v-if="car" class="car-row"><img :src="carImageUrl(car.image)" :alt="car.name" @error="useDefaultCarImage">
            <div>
              <h3>{{ car.name }}</h3>
              <p>{{ car.year }} · {{ car.color }} · {{ car.transmission }}</p>
            </div>
          </div>
        </section>
        <section class="amounts">
          <p><span>Đơn giá niêm yết</span><strong>{{ formatPrice(quote.carPrice) }} VNĐ</strong></p>
          <p :class="{ 'approved-discount': Number(quote.discount) > 0 }"><span>Giảm giá được duyệt</span><strong>-{{ formatPrice(quote.discount) }} VNĐ</strong></p>
          <p class="total"><span>Tổng giá trị xe sau ưu đãi</span><strong>{{ formatPrice(quote.totalPrice) }} VNĐ</strong></p>
        </section>
        <section class="quote-validity">
          <h2>Thời hạn hiệu lực</h2>
          <p><span>Ngày phát hành / duyệt</span><strong>{{ formatDate(issuedAt) }}</strong></p>
          <p><span>Hiệu lực đến hết ngày</span><strong>{{ formatDate(expiryDate) }}</strong></p>
          <p class="price-lock-term">Ưu đãi và mức giá được đại lý bảo lưu đến hết ngày {{ formatDate(expiryDate) }}. Sau thời gian này, báo giá sẽ tự động hết hiệu lực.</p>
        </section>
        <section>
          <h2>Trạng thái</h2><span class="status" :class="{ expired: isExpired }">{{ isExpired ? 'Đã hết hạn' : quote.status }}</span>
          <p v-if="isExpired" class="quote-expired-message">Báo giá đã hết hạn hiệu lực (quá 07 ngày). Vui lòng yêu cầu báo giá mới.</p>
          <p class="mt-3 mb-0"><strong>Ghi chú từ đại lý:</strong> {{ dealerNote }}</p>
        </section>
        <section v-if="!isAdmin && isConfirmed && !isExpired" class="order-form">
          <h2>Thông tin tạo đơn hàng</h2><input v-model.trim="orderForm.address" class="form-control" maxlength="500"
            placeholder="Địa chỉ nhận xe" required><input v-model.trim="orderForm.registrationAddress"
            class="form-control" maxlength="500" placeholder="Địa chỉ đăng ký xe (nếu khác)">
          <div class="form-control">Thanh toán QR SePay</div>
        </section>
        <footer><button class="btn btn-outline-secondary" @click="$router.back()">Quay lại</button><button
            class="btn btn-dark" @click="printQuote">In / Lưu PDF</button><button v-if="!isAdmin && isApproved && !isExpired"
            class="btn btn-danger" :disabled="submitting" @click="handleDepositFromQuotation">Đặt cọc theo báo giá này</button><template
            v-if="isAdmin && isPending"><button class="btn btn-success" :disabled="submitting" @click="updateQuoteStatus('Đã duyệt')">Duyệt báo giá</button><button
            class="btn btn-outline-danger" :disabled="submitting" @click="updateQuoteStatus('Từ chối')">Từ chối</button></template><button
            v-if="!isAdmin && isConfirmed && !isExpired" class="btn btn-danger"
            :disabled="submitting || !orderForm.address" @click="convertToOrder">Tạo đơn hàng</button><router-link
            v-if="!isAdmin && quote.orderId" class="btn btn-danger" :to="`/order/detail/${quote.orderId}`">Xem đơn
            hàng</router-link></footer>
      </article>
    </div>
  </main>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, carImageUrl, cartApi, formatPrice, quotationApi, useDefaultCarImage } from '../api'
import { notifyDataUpdated, useAutoRefresh } from '../composables/useAutoRefresh'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
const route = useRoute(), router = useRouter(), quote = ref({}), car = ref(null), loading = ref(true), submitting = ref(false), error = ref('')
const cart = useCartStore()
const auth = useAuthStore()
const orderForm = ref({ address: '', registrationAddress: '', paymentMethod: 'SePay' })
const normalizedStatus = computed(() => String(quote.value.status || '').trim().toUpperCase())
const isAdmin = computed(() => auth.isAdmin)
const isPending = computed(() => ['PENDING', 'CHỜ XÁC NHẬN'].includes(normalizedStatus.value))
const isApproved = computed(() => ['APPROVED', 'ĐÃ DUYỆT'].includes(normalizedStatus.value))
const isConfirmed = computed(() => ['CONFIRMED', 'KHÁCH ĐÃ XÁC NHẬN'].includes(normalizedStatus.value))
const issuedAt = computed(() => quote.value.quotationDate)
const expiryDate = computed(() => {
  if (!issuedAt.value) return null
  const date = new Date(issuedAt.value)
  if (Number.isNaN(date.getTime())) return null
  date.setDate(date.getDate() + 7)
  date.setHours(23, 59, 59, 999)
  return date
})
const isExpired = computed(() =>
  (isApproved.value || isConfirmed.value) && expiryDate.value && Date.now() > expiryDate.value.getTime())
const dealerNote = computed(() => {
  const note = String(quote.value.promotionName || quote.value.note || '').trim()
  return note || 'Áp dụng theo chính sách ưu đãi hiện hành của đại lý.'
})
const formatDate = v => v ? new Date(v).toLocaleDateString('vi-VN') : ''
const printQuote = () => window.print()
async function load() { try { const { data } = await quotationApi.getById(route.params.id); quote.value = data.data; const response = await carApi.getById(quote.value.carId); car.value = response.data.data || response.data } catch (e) { error.value = e.response?.data?.message || 'Không thể tải báo giá' } finally { loading.value = false } }
async function handleDepositFromQuotation() {
  if (!quote.value?.id || !car.value) return
  if (isExpired.value) {
    error.value = 'Báo giá đã hết hạn hiệu lực (quá 07 ngày). Vui lòng yêu cầu báo giá mới.'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const { data } = await quotationApi.confirm(quote.value.id)
    if (!data?.success || !data.data) {
      throw new Error(data?.message || 'Không thể xác nhận báo giá')
    }
    quote.value = data.data

    const price = Number(quote.value.carPrice ?? car.value.price ?? 0)
    const discountAmount = Math.max(0, Number(quote.value.discount ?? 0))
    const finalPrice = Math.max(0, Number(quote.value.totalPrice ?? price - discountAmount))
    const discountPercent = price > 0 ? discountAmount * 100 / price : 0

    await cartApi.clear()
    cart.setDepositItem({
      id: quote.value.carId ?? car.value.id,
      name: car.value.name,
      year: car.value.year,
      color: car.value.color,
      bodyType: car.value.bodyType,
      image: car.value.image,
      price,
      listPrice: price,
      discountAmount,
      discountPercent,
      finalPrice,
      depositAmount: finalPrice * 0.1,
      quotationId: quote.value.id,
    })
    notifyDataUpdated()
    router.push('/cart/view')
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Không thể chuẩn bị phiếu đặt cọc theo báo giá'
  } finally {
    submitting.value = false
  }
}
async function updateQuoteStatus(status) {
  submitting.value = true
  error.value = ''
  try {
    const { data } = await quotationApi.update(quote.value.id, {
      discount: quote.value.discount || 0,
      note: quote.value.note,
      status,
    })
    if (!data?.success || !data.data) {
      throw new Error(data?.message || 'Không thể cập nhật trạng thái báo giá')
    }
    quote.value = data.data
    notifyDataUpdated()
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Không thể cập nhật trạng thái báo giá'
  } finally {
    submitting.value = false
  }
}
async function convertToOrder() { submitting.value = true; error.value = ''; try { const { data } = await quotationApi.convertToOrder(quote.value.id, orderForm.value); if (!data?.success || !data.data) throw new Error(data?.message || 'Không thể tạo đơn hàng'); notifyDataUpdated(); router.push(`/order/detail/${data.data.id}`) } catch (e) { error.value = e.response?.data?.message || e.message || 'Không thể tạo đơn hàng' } finally { submitting.value = false } }
onMounted(load)
useAutoRefresh(load)
</script>
<style scoped>
.quotation-page {
  background: #f3f4f6
}

.quote-card {
  max-width: 880px;
  margin: auto;
  background: #fff;
  padding: 38px;
  box-shadow: 0 12px 35px #11182718
}

.quote-card header {
  display: flex;
  justify-content: space-between;
  border-bottom: 3px solid #b91c1c;
  padding-bottom: 20px
}

.quote-card h1 {
  font-weight: 900
}

.quote-card header small {
  display: block
}

.eyebrow {
  color: #b91c1c;
  font-weight: 800
}

.quote-card section {
  border-bottom: 1px solid #e5e7eb;
  padding: 22px 0
}

.quote-card h2 {
  font-size: .82rem;
  font-weight: 800;
  text-transform: uppercase
}

.quote-card section>p,
.amounts p {
  display: flex;
  justify-content: space-between
}

.car-row {
  display: flex;
  align-items: center;
  gap: 18px
}

.car-row img {
  width: 150px;
  height: 90px;
  object-fit: cover;
  border-radius: 10px
}

.car-row h3 {
  font-size: 1.1rem;
  font-weight: 800
}

.amounts .total {
  border-top: 2px solid #111827;
  padding-top: 12px;
  font-size: 1.15rem
}

.approved-discount {
  color: #15803d;
  font-weight: 700
}

.status {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  padding: 6px 12px;
  font-weight: 700
}

.status.expired {
  background: #fee2e2;
  color: #b91c1c;
}

.quote-validity p {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
}

.quote-expired-message {
  color: #b91c1c;
  font-weight: 700;
  margin-top: 12px;
}

.price-lock-term {
  color: #6b7280;
  font-size: .85rem;
  line-height: 1.55;
  margin: 14px 0 0;
}

.order-form {
  display: grid;
  gap: 12px
}

.quote-card footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 24px
}

@media(max-width:600px) {
  .quote-card {
    padding: 22px
  }

  .car-row,
  .quote-card header {
    align-items: flex-start;
    flex-direction: column
  }

  .quote-card footer {
    flex-wrap: wrap
  }
}

@media print {
  .quotation-page {
    background: #fff
  }

  .quote-card {
    box-shadow: none
  }

  .quote-card footer {
    display: none
  }
}
</style>
