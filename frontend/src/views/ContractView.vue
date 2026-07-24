<template>
  <main class="contract-page py-5">
    <div v-if="loading" class="container text-center py-5"><span class="spinner-border text-danger"></span><p class="mt-3">Đang tải hợp đồng...</p></div>
    <div v-else-if="error" class="container"><div class="alert alert-danger">{{ error }}</div></div>
    <article v-else class="contract-sheet container">
      <header class="contract-header">
        <div><strong class="brand">CARSTORE</strong><small>Showroom ô tô</small></div>
        <div class="text-center"><h1>HỢP ĐỒNG MUA BÁN XE</h1><p>Số: {{ contract.contractNo || `HĐ-${contract.id}-${order.id}` }}</p><small v-if="contract.quotationId">Báo giá #{{ contract.quotationId }}</small></div>
        <div class="text-end"><small>Ngày lập</small><strong>{{ formatDate(contract.contractDate) }}</strong></div>
      </header>

      <section class="contract-section">
        <h2>Thông tin khách hàng</h2>
        <div class="info-grid">
          <p><span>Họ và tên</span><strong>{{ customer.fullname || 'Chưa cập nhật' }}</strong></p>
          <p><span>Username</span><strong>{{ customer.username }}</strong></p>
          <p><span>Email</span><strong>{{ customer.email || 'Chưa cập nhật' }}</strong></p>
          <p><span>Địa chỉ</span><strong>{{ order.address || 'Chưa cập nhật' }}</strong></p>
        </div>
      </section>

      <section class="contract-section">
        <h2>Thông tin nhân viên</h2>
        <p class="mb-0"><span class="text-secondary">Nhân viên phụ trách: </span><strong>{{ contract.employeeUsername || 'Đang chờ phân công' }}</strong></p>
      </section>

      <section class="contract-section">
        <h2>Thông tin xe</h2>
        <div v-for="item in details" :key="item.id" class="vehicle-row">
          <img :src="carImageUrl(item.car?.image)" :alt="item.car?.name" />
          <div><h3>{{ item.car?.name }}</h3><p>Năm sản xuất: {{ item.car?.year || 'Chưa cập nhật' }} · Màu: {{ item.car?.color || 'Chưa cập nhật' }}</p><strong>{{ formatPrice(item.price) }} VNĐ × {{ item.quantity }}</strong></div>
        </div>
      </section>

      <section class="contract-section">
        <h2>Thông tin đơn hàng và đặt cọc</h2>
        <div class="info-grid">
          <p><span>Order ID</span><strong>#{{ order.id }}</strong></p>
          <p><span>Ngày đặt</span><strong>{{ formatDate(order.create_date) }}</strong></p>
          <p><span>Trạng thái đơn</span><strong>{{ order.status }}</strong></p>
          <p><span>Trạng thái cọc</span><b class="status-badge" :class="{ paid: contract.depositStatus === 'PAID' }">{{ contract.depositStatus }}</b></p>
          <p><span>Phương thức</span><strong>{{ contract.depositMethod || 'Chưa thanh toán' }}</strong></p>
          <p><span>Ngày thanh toán</span><strong>{{ formatDate(contract.depositPaidAt) }}</strong></p>
        </div>
      </section>

      <section class="contract-section payment-summary">
        <h2>Giá trị hợp đồng</h2>
        <p><span>Giá trị xe</span><strong>{{ formatPrice(contract.total) }} VNĐ</strong></p>
        <p><span>Tiền đặt cọc</span><strong>{{ formatPrice(contract.depositAmount || contract.deposit) }} VNĐ</strong></p>
        <p><span>Đã thanh toán</span><strong>{{ formatPrice(paidAmount) }} VNĐ</strong></p>
        <p class="total"><span>Còn lại</span><strong>{{ formatPrice(remaining) }} VNĐ</strong></p>
      </section>

      <section class="contract-section terms"><h2>Điều khoản</h2><ol><li>Xe được bàn giao theo đúng thông tin và tình trạng hai bên đã xác nhận.</li><li>Chính sách bảo hành áp dụng theo thông tin công bố của showroom và nhà sản xuất.</li><li>Thời gian giao xe được thống nhất sau khi hoàn tất nghĩa vụ thanh toán.</li><li>Việc hoàn tiền cọc thực hiện theo trạng thái đơn và thỏa thuận được hai bên xác nhận.</li></ol></section>
      <section class="signatures"><div>KHÁCH HÀNG<small>(Ký và ghi rõ họ tên)</small></div><div>NHÂN VIÊN<small>(Ký và ghi rõ họ tên)</small></div><div>ĐẠI DIỆN SHOWROOM<small>(Ký, đóng dấu)</small></div></section>
      <footer class="contract-actions">
        <button class="btn btn-outline-secondary" @click="$router.back()">Quay lại</button>
        <router-link class="btn btn-danger" :to="`/orders/${order.id}/payment`">Thanh toán</router-link>
        <button class="btn btn-dark" @click="printContract">In / Xuất PDF</button>
      </footer>
    </article>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { carImageUrl, contractApi, formatPrice } from '../api'
const route = useRoute(), loading = ref(true), error = ref(''), data = ref({})
const contract = computed(() => data.value.contract || {}), order = computed(() => data.value.order || {})
const customer = computed(() => data.value.customer || {}), details = computed(() => data.value.details || []), payments = computed(() => data.value.payments || [])
const paidAmount = computed(() => {
  const historyTotal = payments.value.filter(p => p.status === 'Thành công').reduce((sum, p) => sum + Number(p.amount || 0), 0)
  return historyTotal || (contract.value.depositStatus === 'PAID' ? Number(contract.value.depositAmount || 0) : 0)
})
const remaining = computed(() => Math.max(0, Number(contract.value.total || 0) - paidAmount.value))
const formatDate = value => value ? new Date(value).toLocaleString('vi-VN') : 'Chưa cập nhật'
const printContract = () => window.print()
onMounted(async () => { try { const response = await contractApi.getByOrder(route.params.id); data.value = response.data.data } catch (e) { error.value = e.response?.data?.message || 'Không thể tải hợp đồng' } finally { loading.value = false } })
</script>

<style scoped>
.contract-page{background:#eef1f5}.contract-sheet{max-width:980px;background:#fff;padding:42px;box-shadow:0 12px 35px #1f29371a}.contract-header{display:grid;grid-template-columns:1fr 2fr 1fr;align-items:center;border-bottom:3px solid #b91c1c;padding-bottom:24px}.contract-header h1{font-size:1.5rem;font-weight:900}.contract-header small,.contract-header strong{display:block}.brand{color:#b91c1c;font-size:1.35rem}.contract-section{border-bottom:1px solid #e5e7eb;padding:24px 0}.contract-section h2{font-size:1rem;font-weight:800;text-transform:uppercase;margin-bottom:18px}.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 28px}.info-grid p{display:grid;margin:0}.info-grid span{color:#6b7280;font-size:.82rem}.vehicle-row{display:flex;gap:18px;align-items:center}.vehicle-row img{width:150px;height:95px;object-fit:cover;border-radius:10px}.vehicle-row h3{font-size:1.1rem;font-weight:800}.status-badge{justify-self:start;padding:5px 10px;border-radius:999px;background:#fee2e2;color:#991b1b}.status-badge.paid{background:#dcfce7;color:#166534}.payment-summary{margin-left:auto;max-width:480px}.payment-summary p{display:flex;justify-content:space-between}.payment-summary .total{border-top:2px solid #111827;padding-top:12px;font-size:1.1rem}.terms li{margin-bottom:8px}.signatures{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;font-weight:800;min-height:150px;padding-top:28px}.signatures small{display:block;color:#6b7280;font-weight:400}.contract-actions{display:flex;justify-content:flex-end;gap:10px}@media(max-width:700px){.contract-sheet{padding:22px}.contract-header{grid-template-columns:1fr;text-align:left!important;gap:14px}.contract-header .text-end{text-align:left!important}.info-grid,.signatures{grid-template-columns:1fr}.vehicle-row{align-items:flex-start;flex-direction:column}.contract-actions{flex-wrap:wrap}}@media print{.contract-page{background:#fff}.contract-sheet{box-shadow:none}.contract-actions{display:none}}
</style>
