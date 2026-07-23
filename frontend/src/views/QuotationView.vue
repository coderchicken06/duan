<template>
  <main class="quotation-page py-5"><div class="container">
    <div v-if="loading" class="text-center py-5"><span class="spinner-border text-danger"></span></div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <article v-else class="quote-card">
      <header><div><span class="eyebrow">CARSTORE</span><h1>BÁO GIÁ XE</h1></div><div class="text-end"><strong>{{ quote.quotationNo || `BG-${quote.id}` }}</strong><small>{{ formatDate(quote.quotationDate) }}</small></div></header>
      <section><h2>Khách hàng</h2><p><span>Tài khoản</span><strong>{{ quote.customerUsername }}</strong></p></section>
      <section><h2>Thông tin xe</h2><div v-if="car" class="car-row"><img :src="carImageUrl(car.image)" :alt="car.name"><div><h3>{{ car.name }}</h3><p>{{ car.year }} · {{ car.color }} · {{ car.transmission }}</p></div></div></section>
      <section class="amounts"><p><span>Số lượng</span><strong>{{ quote.items?.[0]?.quantity || 1 }}</strong></p><p><span>Đơn giá</span><strong>{{ formatPrice(quote.carPrice) }} VNĐ</strong></p><p><span>Giảm giá được duyệt</span><strong>-{{ formatPrice(quote.discount) }} VNĐ</strong></p><p class="total"><span>Tổng báo giá</span><strong>{{ formatPrice(quote.totalPrice) }} VNĐ</strong></p></section>
      <section><h2>Trạng thái</h2><span class="status">{{ quote.status }}</span><p v-if="quote.note" class="mt-3 mb-0">{{ quote.note }}</p></section>
      <section v-if="quote.status==='Khách đã xác nhận'" class="order-form"><h2>Thông tin tạo đơn hàng</h2><input v-model.trim="orderForm.address" class="form-control" maxlength="500" placeholder="Địa chỉ nhận xe" required><input v-model.trim="orderForm.registrationAddress" class="form-control" maxlength="500" placeholder="Địa chỉ đăng ký xe (nếu khác)"><select v-model="orderForm.paymentMethod" class="form-select"><option value="VNPay">VNPay</option><option value="Chuyển khoản QR">Chuyển khoản QR</option></select></section>
      <footer><button class="btn btn-outline-secondary" @click="$router.back()">Quay lại</button><button class="btn btn-dark" @click="printQuote">In / Lưu PDF</button><button v-if="quote.status==='Đã duyệt'" class="btn btn-danger" :disabled="submitting" @click="confirmQuote">Xác nhận báo giá</button><button v-if="quote.status==='Khách đã xác nhận'" class="btn btn-danger" :disabled="submitting || !orderForm.address" @click="convertToOrder">Tạo đơn hàng</button><router-link v-if="quote.orderId" class="btn btn-danger" :to="`/order/detail/${quote.orderId}`">Xem đơn hàng</router-link></footer>
    </article>
  </div></main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, carImageUrl, formatPrice, quotationApi } from '../api'
const route=useRoute(),router=useRouter(),quote=ref({}),car=ref(null),loading=ref(true),submitting=ref(false),error=ref('')
const orderForm=ref({address:'',registrationAddress:'',paymentMethod:'VNPay'})
const formatDate=v=>v?new Date(v).toLocaleDateString('vi-VN'):''
const printQuote=()=>window.print()
async function load(){try{const {data}=await quotationApi.getById(route.params.id);quote.value=data.data;const response=await carApi.getById(quote.value.carId);car.value=response.data.data||response.data}catch(e){error.value=e.response?.data?.message||'Không thể tải báo giá'}finally{loading.value=false}}
async function confirmQuote(){submitting.value=true;try{const {data}=await quotationApi.confirm(quote.value.id);quote.value=data.data}catch(e){error.value=e.response?.data?.message||'Không thể xác nhận báo giá'}finally{submitting.value=false}}
async function convertToOrder(){submitting.value=true;error.value='';try{const {data}=await quotationApi.convertToOrder(quote.value.id,orderForm.value);router.push(`/order/detail/${data.data.id}`)}catch(e){error.value=e.response?.data?.message||'Không thể tạo đơn hàng'}finally{submitting.value=false}}
onMounted(load)
</script>
<style scoped>.quotation-page{background:#f3f4f6}.quote-card{max-width:880px;margin:auto;background:#fff;padding:38px;box-shadow:0 12px 35px #11182718}.quote-card header{display:flex;justify-content:space-between;border-bottom:3px solid #b91c1c;padding-bottom:20px}.quote-card h1{font-weight:900}.quote-card header small{display:block}.eyebrow{color:#b91c1c;font-weight:800}.quote-card section{border-bottom:1px solid #e5e7eb;padding:22px 0}.quote-card h2{font-size:.82rem;font-weight:800;text-transform:uppercase}.quote-card section>p,.amounts p{display:flex;justify-content:space-between}.car-row{display:flex;align-items:center;gap:18px}.car-row img{width:150px;height:90px;object-fit:cover;border-radius:10px}.car-row h3{font-size:1.1rem;font-weight:800}.amounts .total{border-top:2px solid #111827;padding-top:12px;font-size:1.15rem}.status{display:inline-block;background:#fef3c7;color:#92400e;border-radius:999px;padding:6px 12px;font-weight:700}.order-form{display:grid;gap:12px}.quote-card footer{display:flex;justify-content:flex-end;gap:10px;padding-top:24px}@media(max-width:600px){.quote-card{padding:22px}.car-row,.quote-card header{align-items:flex-start;flex-direction:column}.quote-card footer{flex-wrap:wrap}}@media print{.quotation-page{background:#fff}.quote-card{box-shadow:none}.quote-card footer{display:none}}</style>
