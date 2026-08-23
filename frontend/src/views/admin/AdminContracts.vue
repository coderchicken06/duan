<template><main class="container py-5"><h1>Quản lý hợp đồng</h1><div class="table-responsive cs-card p-3"><table class="table"><thead><tr><th>Mã</th><th>Khách hàng</th><th>Order</th><th>Báo giá</th><th>Giá trị</th><th>Trạng thái</th><th></th></tr></thead><tbody><tr v-for="item in contracts" :key="item.id"><td>{{ item.contractNo||`HD-${item.id}` }}</td><td>{{ item.customerUsername }}</td><td>#{{ item.orderId }}</td><td>{{ item.quotationId?`#${item.quotationId}`:'-' }}</td><td>{{ formatPrice(item.total) }}</td><td><select v-model="item.status" class="form-select form-select-sm" :disabled="isSaving(item.id)"><option>Chờ ký</option><option>Đã ký</option><option>Hủy</option></select></td><td><button class="btn btn-sm btn-danger" :disabled="isSaving(item.id)" @click="save(item)">{{ isSaving(item.id) ? 'Đang lưu...' : 'Lưu' }}</button> <router-link class="btn btn-sm btn-outline-secondary" :to="`/orders/${item.orderId}/contract`">Xem</router-link></td></tr></tbody></table></div></main></template>
<script setup>
import { onMounted, ref } from 'vue'
import { contractApi, formatPrice } from '../../api'
import { showCartToast } from '../../composables/useCartToast'

const contracts = ref([])
const savingId = ref(null)

async function load() {
  try {
    const { data } = await contractApi.getAll()
    contracts.value = data.data || []
  } catch (e) {
    showCartToast(e.response?.data?.message || 'Không thể tải hợp đồng', 'error')
  }
}

async function save(item) {
  if (isSaving(item.id)) return
  savingId.value = item.id
  try {
    const { data } = await contractApi.update(item.id, {
      status: item.status,
      employeeUsername: item.employeeUsername,
      pdfPath: item.pdfPath,
    })
    Object.assign(item, data.data)
    showCartToast('Đã cập nhật hợp đồng')
  } catch (e) {
    showCartToast(e.response?.data?.message || 'Không thể cập nhật hợp đồng', 'error')
  } finally {
    savingId.value = null
  }
}

const isSaving = (contractId) => savingId.value === contractId

onMounted(load)
</script>
