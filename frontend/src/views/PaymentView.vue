<template>
  <main class="container py-5 payment-page">
    <div class="mb-4"><span class="eyebrow">THANH TOÁN AN TOÀN</span>
      <h1>Thanh toán đơn #{{ route.params.id }}</h1>
      <p class="text-secondary">Theo dõi tiền cọc và lịch sử giao dịch của hợp đồng.</p>
    </div>
    <div v-if="loading" class="text-center py-5"><span class="spinner-border text-danger"></span></div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else class="payment-grid">
      <section class="cs-card p-4">
        <h2>Thanh toán tiền cọc</h2>
        <div class="amount">{{ formatPrice(contract.depositAmount || contract.deposit) }} VNĐ</div>

        <div v-if="contract.depositStatus === 'PAID'" class="alert alert-success">
          Tiền cọc đã được xác nhận thành công.
        </div>
        <div v-else-if="isTimeout" class="alert alert-danger">
          <i class="bi bi-x-circle-fill me-1"></i>
          Giao dịch đã hết hạn (quá 3 phút). Vui lòng tạo mã QR mới để thanh toán lại.
        </div>
        <div v-else>
          <!-- Nút lấy mã QR (ẩn đi khi QR đã được tạo) -->
          <button v-if="!qrUrl" class="btn btn-danger w-100" :disabled="submitting" @click="payDeposit">
            {{ submitting ? 'Đang tạo mã QR...' : 'Lấy mã QR thanh toán' }}
          </button>

          <!-- KHU VỰC HIỂN THỊ MÃ QR ĐẸP MẮT -->
          <div v-else class="text-center mt-4">
            <h5 class="fw-bold mb-3">Quét QR để thanh toán</h5>

            <!-- Hiển thị đồng hồ đếm ngược 3 phút -->
            <div class="alert alert-warning py-2 mb-3 fw-bold text-danger">
              Thời gian giữ lệnh: {{ formatCountdown }}
            </div>

            <div class="qr-wrapper mx-auto mb-3">
              <div class="qr-scanner-frame">
                <!-- Biến qrUrl nhận trực tiếp từ Backend -->
                <img :src="qrUrl" alt="Mã QR Thanh Toán" class="qr-image img-fluid" />
              </div>
            </div>
            <p class="mt-2 text-muted mb-3">Sử dụng ứng dụng ngân hàng để quét mã QR</p>

            <div class="bank-details-box text-start p-3 rounded mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Ngân hàng</span>
                <strong>VietinBank</strong>
              </div>
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted small">Số tài khoản</span>
                <strong>102880629915</strong>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted small">Nội dung</span>
                <strong class="text-primary bg-white px-2 py-1 rounded border">SEVQR VELOR{{ route.params.id }}</strong>
              </div>
            </div>
            <div class="alert alert-warning small text-start mb-0">
              <i class="bi bi-exclamation-triangle-fill me-1"></i>
              Vui lòng giữ nguyên nội dung chuyển khoản để hệ thống xác nhận tự động.
            </div>
          </div>

          <p v-if="!qrUrl" class="gateway-note mt-3 mb-0">
            Giao dịch chỉ được ghi nhận sau khi hệ thống xác nhận thanh toán thành công qua ngân hàng.
          </p>
        </div>
      </section>

      <section class="cs-card p-4">
        <h2>Lịch sử thanh toán</h2>
        <div v-if="!payments.length" class="empty">Chưa có giao dịch nào.</div>
        <div v-for="item in payments" :key="item.id" class="history-row">
          <div><strong>{{ item.transactionNo }}</strong><small>{{ formatDate(item.paidAt) }} · {{ item.gateway
          }}<template v-if="item.bankCode"> · {{ item.bankCode }}</template></small>
          </div>
          <div class="text-end"><strong>{{ formatPrice(item.amount) }} VNĐ</strong><span>{{ item.status }}<template
                v-if="item.responseCode"> ({{ item.responseCode }})</template></span></div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { contractApi, paymentTransactionApi, formatPrice } from '../api'

const route = useRoute(), router = useRouter()
const loading = ref(true), submitting = ref(false), error = ref(''), contract = ref({}), payments = ref([])
// Thêm biến lưu URL ảnh QR
const qrUrl = ref('')
let pollInterval = null
let countdownInterval = null

// Giới hạn thời gian 3 phút = 180 giây
const timeLeft = ref(180)
const isTimeout = ref(false)

const formatDate = value => value ? new Date(value).toLocaleString('vi-VN') : ''

// Format thời gian đếm ngược dạng phút:giây (ví dụ: 02:59)
const formatCountdown = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

async function load() {
  loading.value = true;
  try {
    const [contractResponse, transactionResponse] = await Promise.all([contractApi.getByOrder(route.params.id), paymentTransactionApi.getByOrder(route.params.id)]);
    contract.value = contractResponse.data.data.contract;
    payments.value = transactionResponse.data.data || []
  } catch (e) {
    error.value = e.response?.data?.message || 'Không thể tải thông tin thanh toán'
  } finally {
    loading.value = false
  }
}

async function checkPaymentStatus() {
  if (isTimeout.value) return;

  try {
    const [contractResponse, transactionResponse] = await Promise.all([
      contractApi.getByOrder(route.params.id),
      paymentTransactionApi.getByOrder(route.params.id)
    ]);

    const updatedContract = contractResponse.data.data.contract;
    const updatedPayments = transactionResponse.data.data || [];

    // Cập nhật lại danh sách lịch sử thanh toán trên giao diện real-time
    payments.value = updatedPayments;

    // Nếu trạng thái cọc đã chuyển thành PAID, tự động dừng mọi tiến trình và cập nhật
    if (updatedContract && updatedContract.depositStatus === 'PAID') {
      contract.value = updatedContract;
      stopAllTimers();
    }
  } catch (e) {
    // Bỏ qua lỗi ngầm trong lúc polling
  }
}

function startPolling() {
  if (!pollInterval) {
    pollInterval = setInterval(checkPaymentStatus, 3000);
  }

  if (!countdownInterval) {
    timeLeft.value = 180; // Reset lại đúng 3 phút
    isTimeout.value = false;

    countdownInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        // Hết 3 phút -> Báo hết hạn / chuyển khoản thất bại
        isTimeout.value = true;
        stopAllTimers();
      }
    }, 1000);
  }
}

function stopAllTimers() {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

async function payDeposit() {
  submitting.value = true;
  error.value = '';
  try {
    const { data } = await paymentTransactionApi.createQr(route.params.id);
    if (!data.success) throw new Error(data.message);

    // Gán thẳng URL ảnh VietQR trả về từ Backend vào biến qrUrl thay vì tạo form chuyển hướng
    qrUrl.value = data.data.qrUrl;

    // Bắt đầu bật luồng lắng nghe và đếm ngược 3 phút
    startPolling();

  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Không thể tạo thanh toán mã QR'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await load();
  if (route.query.method === 'sepay' && contract.value.depositStatus !== 'PAID') {
    await payDeposit();
  } else if (contract.value.depositStatus !== 'PAID' && qrUrl.value) {
    startPolling();
  }
})

onUnmounted(() => {
  stopAllTimers();
})
</script>

<style scoped>
.payment-page {
  max-width: 1050px
}

.eyebrow {
  color: #b91c1c;
  font-size: .75rem;
  font-weight: 800;
  letter-spacing: .12em
}

.payment-page h1 {
  font-weight: 800
}

.payment-grid {
  display: grid;
  grid-template-columns: .85fr 1.15fr;
  gap: 22px
}

.cs-card h2 {
  font-size: 1.15rem;
  font-weight: 800
}

.amount {
  color: #b91c1c;
  font-size: 1.8rem;
  font-weight: 900;
  margin: 20px 0
}

.gateway-note {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 12px;
  color: #9a3412;
  padding: 16px
}

.history-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 0
}

.history-row small,
.history-row span {
  display: block;
  color: #6b7280
}

.empty {
  text-align: center;
  color: #6b7280;
  padding: 45px 10px
}

@media(max-width:760px) {
  .payment-grid {
    grid-template-columns: 1fr
  }
}

/* CSS CHO KHUNG QUÉT QR */
.qr-wrapper {
  position: relative;
  width: 260px;
  height: 260px;
  padding: 15px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.qr-scanner-frame {
  position: relative;
  width: 100%;
  height: 100%;
}

.qr-scanner-frame::before,
.qr-scanner-frame::after,
.qr-wrapper::before,
.qr-wrapper::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #0d6efd;
  border-style: solid;
}

.qr-scanner-frame::before {
  top: -5px;
  left: -5px;
  border-width: 3px 0 0 3px;
}

.qr-scanner-frame::after {
  top: -5px;
  right: -5px;
  border-width: 3px 3px 0 0;
}

.qr-wrapper::before {
  bottom: 10px;
  left: 10px;
  border-width: 0 0 3px 3px;
}

.qr-wrapper::after {
  bottom: 10px;
  right: 10px;
  border-width: 0 3px 3px 0;
}

.qr-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.bank-details-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}
</style>