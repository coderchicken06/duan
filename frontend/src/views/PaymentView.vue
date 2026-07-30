<template>
  <main class="container py-5 payment-page">
    <div class="mb-4"><span class="eyebrow">THANH TOÁN AN TOÀN</span><h1>Thanh toán đơn #{{ route.params.id }}</h1><p class="text-secondary">Theo dõi tiền cọc và lịch sử giao dịch của hợp đồng.</p></div>
    <div v-if="loading" class="text-center py-5"><span class="spinner-border text-danger"></span></div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else class="payment-grid">
      <section class="cs-card p-4">
        <h2>Thanh toán tiền cọc</h2>
        <div class="amount">{{ formatPrice(contract.depositAmount || contract.deposit) }} VNĐ</div>
        <p>Nội dung: <strong>VELORA-{{ contract.orderId }}</strong></p>
        <div v-if="contract.depositStatus === 'PAID'" class="alert alert-success">Tiền cọc đã được xác nhận thành công.</div>
        <div v-else><button class="btn btn-danger w-100" :disabled="submitting" @click="payDeposit">{{ submitting ? 'Đang chuyển đến SePay...' : 'Thanh toán QR SePay' }}</button><p class="gateway-note mt-3 mb-0">Giao dịch chỉ được ghi nhận sau khi SePay gửi webhook xác nhận thanh toán thành công.</p></div>
      </section>
      <section class="cs-card p-4"><h2>Lịch sử thanh toán</h2><div v-if="!payments.length" class="empty">Chưa có giao dịch nào.</div><div v-for="item in payments" :key="item.id" class="history-row"><div><strong>{{ item.transactionNo }}</strong><small>{{ formatDate(item.paidAt) }} · {{ item.gateway }}<template v-if="item.bankCode"> · {{ item.bankCode }}</template></small></div><div class="text-end"><strong>{{ formatPrice(item.amount) }} VNĐ</strong><span>{{ item.status }}<template v-if="item.responseCode"> ({{ item.responseCode }})</template></span></div></div></section>
    </div>
  </main>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { contractApi, paymentTransactionApi, formatPrice } from '../api'
const route=useRoute(), loading=ref(true), submitting=ref(false), error=ref(''), contract=ref({}), payments=ref([])
const formatDate=value=>value?new Date(value).toLocaleString('vi-VN'):''
async function load(){loading.value=true;try{const[contractResponse,transactionResponse]=await Promise.all([contractApi.getByOrder(route.params.id),paymentTransactionApi.getByOrder(route.params.id)]);contract.value=contractResponse.data.data.contract;payments.value=transactionResponse.data.data||[]}catch(e){error.value=e.response?.data?.message||'Không thể tải thông tin thanh toán'}finally{loading.value=false}}
async function payDeposit(){submitting.value=true;error.value='';try{const{data}=await paymentTransactionApi.createQr(route.params.id);if(!data.success)throw new Error(data.message);const form=document.createElement('form');form.method=data.data.method||'POST';form.action=data.data.checkoutUrl;Object.entries(data.data.fields||{}).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input)});document.body.appendChild(form);form.submit()}catch(e){error.value=e.response?.data?.message||e.message||'Không thể tạo thanh toán QR SePay'}finally{submitting.value=false}}
onMounted(async()=>{await load();if(route.query.method==='sepay'&&contract.value.depositStatus!=='PAID')await payDeposit()})
</script>
<style scoped>.payment-page{max-width:1050px}.eyebrow{color:#b91c1c;font-size:.75rem;font-weight:800;letter-spacing:.12em}.payment-page h1{font-weight:800}.payment-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:22px}.cs-card h2{font-size:1.15rem;font-weight:800}.amount{color:#b91c1c;font-size:1.8rem;font-weight:900;margin:20px 0}.gateway-note{background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;color:#9a3412;padding:16px}.history-row{display:flex;justify-content:space-between;border-bottom:1px solid #e5e7eb;padding:16px 0}.history-row small,.history-row span{display:block;color:#6b7280}.empty{text-align:center;color:#6b7280;padding:45px 10px}@media(max-width:760px){.payment-grid{grid-template-columns:1fr}}</style>
