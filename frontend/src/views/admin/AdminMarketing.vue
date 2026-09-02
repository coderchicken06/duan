<template>
    <main class="container py-5">
        <h1>Khuyến mãi & Tin tức</h1>
        <div class="marketing-grid">
            <section class="cs-card p-4">
                <h2>Khuyến mãi</h2>
                <form class="form-grid" @submit.prevent="savePromotion"><input v-model.trim="promotion.name"
                        class="form-control" placeholder="Tiêu đề khuyến mãi" required><select v-model.number="selectedCarId"
                        class="form-select" required><option disabled :value="null">Chọn xe áp dụng</option><option
                            v-for="car in cars" :key="car.id" :value="car.id">{{ car.name }}</option></select><select v-model="promotion.type"
                        class="form-select">
                        <option value="PERCENT">Phần trăm</option>
                        <option value="FIXED">Số tiền</option>
                    </select><input v-model.number="promotion.value" class="form-control" type="number" min="1"
                        placeholder="Giá trị" required><DatePickerInput v-model="promotion.startDate" :min="today"
                        aria-label="Ngày bắt đầu" title="Ngày bắt đầu (dd/mm/yyyy)" /><DatePickerInput
                        v-model="promotion.endDate" :min="today" aria-label="Ngày kết thúc"
                        title="Ngày kết thúc (dd/mm/yyyy)" /><label><input
                            v-model="promotion.status" type="checkbox"> Đang hoạt động</label><button
                        class="btn btn-danger" :disabled="submitting">{{ submitting ? 'Đang lưu...' : (promotion.id ? 'Cập nhật' : 'Thêm') }}</button></form>
                <div v-for="item in promotions" :key="item.id" class="admin-row"><span><strong>{{ item.name
                            }}</strong><small>{{ assignedCarName(item.id) }} giảm {{ item.value }}{{ item.type === 'PERCENT' ? '%' :
                                ' VNĐ'
                            }}</small><small>Thời gian: {{ formatDateDisplay(item.startDate) || '—' }} - {{
                                formatDateDisplay(item.endDate) || '—' }}</small></span><span><button v-if="!item.status"
                                class="btn btn-sm btn-outline-success" :disabled="submitting" @click="setPromotionStatus(item, true)">Áp dụng</button><button
                                v-else class="btn btn-sm btn-outline-warning" :disabled="submitting" @click="setPromotionStatus(item, false)">Ngừng áp dụng</button><button
                            class="btn btn-sm btn-outline-primary"
                            :disabled="submitting" @click="editPromotion(item)">Sửa</button><button
                            class="btn btn-sm btn-outline-danger" :disabled="submitting" @click="removePromotion(item.id)">Xóa</button></span>
                </div>
            </section>
            <section class="cs-card p-4">
                <h2>Tin tức</h2>
                <form class="form-grid" @submit.prevent="saveNews">
                    <input v-model.trim="article.title" class="form-control" placeholder="Tiêu đề" required>
                    <div class="d-flex gap-2">
                        <input v-model.trim="article.thumbnail" class="form-control" placeholder="tên file ảnh"><input
                            type="file" accept="image/*" class="form-control" @change="onNewsFileChange">
                    </div>
                    <textarea v-model.trim="article.summary" class="form-control" maxlength="500"
                        placeholder="Tóm tắt"></textarea><textarea v-model.trim="article.content" class="form-control"
                        rows="5" placeholder="Nội dung"></textarea><select v-model="article.status" class="form-select">
                        <option value="DRAFT">Bản nháp</option>
                        <option value="PUBLISHED">Xuất bản</option>
                    </select><button class="btn btn-danger" :disabled="submitting">{{ submitting ? 'Đang lưu...' : (article.id ? 'Cập nhật' : 'Thêm') }}</button>
                </form>
                <div v-for="item in articles" :key="item.id" class="admin-row"><span><strong>{{ item.title
                            }}</strong><small>{{ item.status }}</small></span><span><button
                            class="btn btn-sm btn-outline-primary" :disabled="submitting" @click="article = { ...item }">Sửa</button><button
                            class="btn btn-sm btn-outline-danger" :disabled="submitting" @click="removeNews(item.id)">Xóa</button></span></div>
            </section>
        </div>
    </main>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { adminApi, promotionApi, newsApi, uploadApi } from '../../api'
import { showCartToast } from '../../composables/useCartToast'
import { notifyDataUpdated, useAutoRefresh } from '../../composables/useAutoRefresh'
import DatePickerInput from '../../components/DatePickerInput.vue'

const promotions = ref([]), articles = ref([]), cars = ref([])
const assignments = ref({})
const selectedCarId = ref(null)
const submitting = ref(false)
const route = useRoute()
const emptyPromotion = () => ({ name: '', type: 'PERCENT', value: null, startDate: '', endDate: '', status: true })
const emptyNews = () => ({ title: '', thumbnail: '', summary: '', content: '', status: 'DRAFT' })
const promotion = ref(emptyPromotion()), article = ref(emptyNews())
const dateInput = v => v ? String(v).slice(0, 10) : ''
const today = (() => {
    const value = new Date()
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})()
const formatDateDisplay = v => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateInput(v))
    return match ? `${match[3]}/${match[2]}/${match[1]}` : ''
}

async function load() {
    const [p, n, c] = await Promise.all([promotionApi.getAll(), newsApi.getAll(), adminApi.getCars()])
    promotions.value = p.data.data || []
    articles.value = n.data.data || []
    cars.value = Array.isArray(c.data) ? c.data : c.data.data || []
    const pairs = await Promise.all(promotions.value.map(async item => {
        const { data } = await promotionApi.getAssignedCars(item.id)
        return [item.id, data.data?.[0]?.carId || null]
    }))
    assignments.value = Object.fromEntries(pairs)
}

function assignedCarName(promotionId) {
    const carId = assignments.value[promotionId]
    return cars.value.find(car => car.id === carId)?.name || 'Chưa chọn xe'
}

async function action(fn, success) {
    if (submitting.value) return false
    submitting.value = true
    try {
        const response = await fn()
        if (response?.data?.success === false) {
            showCartToast(response.data.message || 'Không thể thực hiện', 'error')
            return false
        }
        notifyDataUpdated()
        await load()
        showCartToast(success)
        return true
    }
    catch (e) { showCartToast(e.response?.data?.message || e.message || 'Không thể thực hiện', 'error'); return false }
    finally { submitting.value = false }
}

async function savePromotion() {
    if (!selectedCarId.value) { showCartToast('Vui lòng chọn xe áp dụng.', 'warning'); return }
    const successMessage = promotion.value.id ? 'Đã cập nhật khuyến mãi' : 'Đã thêm khuyến mãi'
    const payload = {
        ...promotion.value,
        startDate: dateInput(promotion.value.startDate),
        endDate: dateInput(promotion.value.endDate),
    }
    const saved = await action(async () => {
        const response = promotion.value.id
            ? await promotionApi.update(promotion.value.id, payload)
            : await promotionApi.create(payload)
        if (response.data.success === false) return response
        promotion.value = {
            ...response.data.data,
            startDate: dateInput(response.data.data.startDate),
            endDate: dateInput(response.data.data.endDate),
        }
        return promotionApi.assignToCar(response.data.data.id, selectedCarId.value)
    }, successMessage)
    if (saved) {
        promotion.value = emptyPromotion()
        selectedCarId.value = null
    }
}

function editPromotion(item) {
    promotion.value = { ...item, startDate: dateInput(item.startDate), endDate: dateInput(item.endDate) }
    selectedCarId.value = assignments.value[item.id] || null
}

async function setPromotionStatus(item, status) {
    await action(() => promotionApi.update(item.id, { ...item, status }), status ? 'Đã áp dụng khuyến mãi' : 'Đã ngừng áp dụng khuyến mãi')
}

async function removePromotion(id) { if (confirm('Xóa khuyến mãi này?')) await action(() => promotionApi.delete(id), 'Đã xóa khuyến mãi') }
async function onNewsFileChange(e) { const file = e.target.files?.[0]; if (!file) return; try { const { data } = await uploadApi.upload(file); article.value.thumbnail = data; showCartToast('Đã tải ảnh lên') } catch (error) { showCartToast(error.response?.data?.message || 'Không thể tải ảnh lên', 'error') } finally { e.target.value = '' } }
async function saveNews() {
    const successMessage = article.value.id ? 'Đã cập nhật tin tức' : 'Đã thêm tin tức'
    const payload = { ...article.value, slug: '' }
    const saved = await action(async () => {
        const response = article.value.id
            ? await newsApi.update(article.value.id, payload)
            : await newsApi.create(payload)
        if (response.data.success === false) return response
        article.value = { ...response.data.data }
        return response
    }, successMessage)
    if (saved) article.value = emptyNews()
}
async function removeNews(id) { if (confirm('Xóa tin tức này?')) await action(() => newsApi.delete(id), 'Đã xóa tin tức') }
onMounted(load)
useAutoRefresh(load)
watch(() => route.fullPath, load)
</script>
<style scoped>
.marketing-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 22px
}

.form-grid {
    display: grid;
    gap: 10px;
    margin: 20px 0
}

.admin-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    border-top: 1px solid #e5e7eb;
    padding: 13px 0
}

.admin-row span {
    display: flex;
    gap: 6px
}

.admin-row span:first-child {
    flex-direction: column
}

.admin-row small {
    color: #6b7280
}

button:disabled {
    cursor: wait;
    opacity: .65
}

@media(max-width:900px) {
    .marketing-grid {
        grid-template-columns: 1fr
    }
}
</style>
