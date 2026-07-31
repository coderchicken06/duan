<template>
    <div class="container cs-container py-5">
        <h2 class="cs-page-title mb-4">Lịch sử yêu cầu báo giá</h2>

        <div v-if="loading" class="text-center py-5">
            <span class="spinner-border text-danger"></span>
        </div>

        <div v-else-if="error" class="alert alert-danger">
            {{ error }}
        </div>

        <div v-else class="table-responsive cs-card p-3">
            <table class="table cs-table mb-0">
                <thead>
                    <tr>
                        <th>Mã</th>
                        <th>Ngày tạo</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="quote in quotationList" :key="quote.id">
                        <td>{{ quote.quotationNo || `BG-${quote.id}` }}</td>
                        <td>{{ formatDate(quote.quotationDate) }}</td>
                        <td>{{ formatPrice(quote.totalPrice) }} VNĐ</td>
                        <td>{{ quote.status }}</td>
                        <td><router-link :to="`/quotations/${quote.id}`">Xem</router-link></td>
                    </tr>
                </tbody>
            </table>
            <p v-if="quotationList.length === 0" class="text-center cs-muted py-4">Chưa có báo giá nào.</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { quotationApi, formatPrice } from '../api'

const quotationList = ref([])
const loading = ref(true)
const error = ref('')

const formatDate = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : '-'

onMounted(async () => {
    try {
        const { data } = await quotationApi.getMine()
        quotationList.value = data.data || []
    } catch (e) {
        error.value = e.response?.data?.message || 'Không thể tải lịch sử yêu cầu báo giá.'
    } finally {
        loading.value = false
    }
})
</script>