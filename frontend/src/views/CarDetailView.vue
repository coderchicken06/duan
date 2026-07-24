<template>
  <main v-if="car" class="detail-page">
    <div class="container detail-container py-4">
      <div class="detail-hero">
        <section class="gallery-card">
          <div class="main-image-wrap">
            <img class="main-image" :src="selectedImage" :alt="car.name" />
            <button v-if="galleryImages.length > 1" class="gallery-arrow gallery-arrow-left" type="button" aria-label="Ảnh trước" @click="previousImage">‹</button>
            <button v-if="galleryImages.length > 1" class="gallery-arrow gallery-arrow-right" type="button" aria-label="Ảnh tiếp theo" @click="nextImage">›</button>
          </div>

          <div v-if="galleryImages.length > 0" class="thumbnail-row">
            <button
              v-for="(image, index) in galleryImages"
              :key="`${image}-${index}`"
              type="button"
              :class="['thumbnail-button', { active: image === selectedImage }]"
              :aria-label="`Xem ảnh ${index + 1} của ${car.name}`"
              @click="selectedImage = image"
            >
              <img :src="image" :alt="`${car.name} - ảnh ${index + 1}`" />
            </button>
          </div>
        </section>

        <section class="summary-card">
          <span class="eyebrow">CARSTORE SELECT</span>
          <h1>{{ car.name }}</h1>

          <div class="summary-meta">
            <span v-if="hasData(car.year)">{{ car.year }}</span>
            <span v-if="hasData(car.mileage)">{{ km(car.mileage) }}</span>
            <span v-if="hasData(car.bodyType)">{{ car.bodyType }}</span>
          </div>

          <div class="price">{{ formatPrice(car.price) }} <small>VNĐ</small></div>

          <div v-if="quickSpecs.length" class="quick-specs">
            <div v-for="item in quickSpecs" :key="item.label">
              <small>{{ item.label }}</small><strong>{{ item.value }}</strong>
            </div>
          </div>

          <div v-if="message" :class="['alert', success ? 'alert-success' : 'alert-danger']">
            {{ message }}
          </div>

          <div class="action-grid">
            <button class="ford-btn-primary hero-action" type="button" :disabled="Number(car.stock || 0) <= 0" @click="addToCart">
              <span class="action-icon" aria-hidden="true">🛒</span>
              <span>{{ Number(car.stock || 0) > 0 ? 'Thêm vào giỏ hàng' : 'Xe đã hết hàng' }}</span>
            </button>
            <button class="ford-btn-outline hero-action" type="button" @click="toggleCurrent">
              <span class="action-icon" aria-hidden="true">⚖</span>
              <span>{{ has(car.id) ? 'Bỏ khỏi so sánh' : 'Thêm vào so sánh' }}</span>
            </button>
            <router-link class="ford-btn-outline hero-action text-center" :to="{ path: '/service', query: { carId: car.id } }">
              <span class="action-icon" aria-hidden="true">▣</span>
              <span>Đặt lịch xem xe</span>
            </router-link>
            <button class="ford-btn-outline hero-action" type="button" @click="requestQuotation">
              <span class="action-icon" aria-hidden="true">₫</span>
              <span>Yêu cầu báo giá</span>
            </button>
          </div>

          <div v-if="hasDealerInfo" class="dealer-box">
            <span class="dealer-icon" aria-hidden="true">⌖</span>
            <div>
              <strong v-if="hasData(car.dealerName)">{{ car.dealerName }}</strong>
              <span v-if="hasData(car.dealerAddress)">{{ car.dealerAddress }}</span>
              <span v-if="hasData(car.warranty)">Bảo hành: {{ car.warranty }}</span>
            </div>
          </div>
        </section>
      </div>

      <section v-if="hasData(car.description) || detailRows.length" class="detail-section">
        <div class="section-heading">
          <span>THÔNG TIN XE</span>
          <h2>Thông tin chi tiết</h2>
        </div>
        <p v-if="hasData(car.description)" class="description">{{ car.description }}</p>
        <div v-if="detailRows.length" class="spec-grid">
          <div v-for="item in detailRows" :key="item.label" class="spec-item">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>

      <section v-if="safetyFeatures.length || comfortFeatures.length" class="detail-section two-columns">
        <article v-if="safetyFeatures.length" class="feature-card">
          <h3>Trang bị an toàn</h3>
          <ul>
            <li v-for="item in safetyFeatures" :key="item">✓ {{ item }}</li>
          </ul>
        </article>
        <article v-if="comfortFeatures.length" class="feature-card">
          <h3>Tiện nghi nổi bật</h3>
          <ul>
            <li v-for="item in comfortFeatures" :key="item">✓ {{ item }}</li>
          </ul>
        </article>
      </section>

      <section v-if="hasInspectionInfo" class="detail-section inspection">
        <div>
          <span class="eyebrow">KIỂM ĐỊNH CARSTORE</span>
          <h2 v-if="hasData(car.inspectionLevel)">{{ car.inspectionLevel }}</h2>
          <p v-if="hasData(car.inspectionNote)">{{ car.inspectionNote }}</p>
        </div>
      </section>

      <section v-if="similarCars.length" class="detail-section">
        <div class="section-heading">
          <span>ĐỀ XUẤT</span>
          <h2>Xe tương tự</h2>
        </div>
        <div class="similar-cars-row">
          <div v-for="item in similarCars" :key="item.id" class="similar-car-item">
            <CarCard :car="item" @add-cart="addById" />
          </div>
        </div>
      </section>

      <section class="detail-section review-section">
        <div class="section-heading"><span>KHÁCH HÀNG</span><h2>Đánh giá xe</h2></div>
        <div class="review-summary"><strong>{{ reviewAverage.toFixed(1) }}/5</strong><span>{{ reviews.length }} đánh giá từ khách đã mua</span></div>
        <form v-if="auth.isLoggedIn && (!myReview || editingReviewId)" class="review-form" @submit.prevent="submitReview">
          <select v-model.number="reviewForm.rating" class="form-select" required><option :value="0" disabled>Chọn số sao</option><option v-for="star in 5" :key="star" :value="star">{{ star }} sao</option></select>
          <textarea v-model="reviewForm.comment" class="form-control" rows="3" maxlength="1000" placeholder="Chia sẻ trải nghiệm của bạn" required></textarea>
          <div class="review-actions"><button class="ford-btn-primary" type="submit" :disabled="reviewSubmitting">{{ reviewSubmitting ? 'Đang lưu...' : (editingReviewId ? 'Lưu đánh giá' : 'Gửi đánh giá') }}</button><button v-if="editingReviewId" class="btn btn-outline-secondary" type="button" @click="cancelReviewEdit">Hủy</button></div>
        </form>
        <div v-if="reviewMessage" class="alert mt-3" :class="reviewOk ? 'alert-success' : 'alert-danger'">{{ reviewMessage }}</div>
        <div v-if="reviews.length" class="review-list"><article v-for="review in reviews" :key="review.id" class="review-item"><div class="review-avatar">{{ review.username?.charAt(0)?.toUpperCase() }}</div><div class="review-content"><strong>{{ review.username }}</strong><div class="review-stars">{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5-review.rating) }}</div><p>{{ review.comment }}</p><small>{{ new Date(review.reviewDate).toLocaleDateString('vi-VN') }}</small><div v-if="isOwnReview(review)" class="review-actions mt-2"><button class="btn btn-sm btn-outline-primary" type="button" @click="startReviewEdit(review)">Sửa</button><button class="btn btn-sm btn-outline-danger" type="button" @click="deleteReview(review)">Xóa</button></div></div></article></div>
        <p v-else class="ford-empty-state">Xe này chưa có đánh giá.</p>
      </section>
    </div>
  </main>

  <div v-else class="container py-5 text-center">
    <div v-if="loadError" class="alert alert-danger">{{ loadError }}</div>
    <p v-else>Đang tải...</p>
    <router-link v-if="loadError" class="ford-btn-outline text-center" to="/car/list">Quay lại danh sách xe</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, cartApi, carImageUrl, formatPrice, quotationApi } from '../api'
import CarCard from '../components/CarCard.vue'
import { useCompare } from '../composables/useCompare'
import { useAuthStore } from '../stores/auth'
import { reviewApi } from '../api'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const car = ref(null)
const reviews = ref([])
const reviewAverage = ref(0)
const reviewForm = ref({ rating: 0, comment: '' })
const reviewSubmitting = ref(false)
const reviewMessage = ref('')
const reviewOk = ref(false)
const editingReviewId = ref(null)
const cars = ref([])
const similarCars = ref([])
const message = ref('')
const success = ref(false)
const selectedImage = ref('')
const serverImages = ref([])
const loadError = ref('')

const { has, toggle, count } = useCompare()
const myReview = computed(() => reviews.value.find(isOwnReview))

const hasData = (value) => value !== null && value !== undefined
  && (typeof value !== 'string' || value.trim() !== '')
const km = (value) => `${Number(value).toLocaleString('vi-VN')} km`
const splitFeatures = (text) =>
  hasData(text) ? text.split(/[,;\n]/).map((value) => value.trim()).filter(Boolean) : []

const quickSpecs = computed(() => [
  { label: 'Động cơ', value: car.value?.engineCapacity },
  { label: 'Hộp số', value: car.value?.transmission },
  { label: 'Dẫn động', value: car.value?.drivetrain },
  { label: 'Nhiên liệu', value: car.value?.fuelType || car.value?.engineType },
].filter((item) => hasData(item.value)))

const safetyFeatures = computed(() => splitFeatures(car.value?.safetyFeatures))
const comfortFeatures = computed(() => splitFeatures(car.value?.comfortFeatures))
const hasInspectionInfo = computed(() =>
  hasData(car.value?.inspectionLevel) || hasData(car.value?.inspectionNote))
const hasDealerInfo = computed(() =>
  hasData(car.value?.dealerName) || hasData(car.value?.dealerAddress) || hasData(car.value?.warranty))

const galleryImages = computed(() => {
  if (!car.value) return []
  const apiImages = serverImages.value.map((item) => item.imageUrl)
  const candidates = [car.value.image, ...apiImages]
  return [...new Set(candidates.filter(Boolean).map((image) => carImageUrl(image)))]
})

const currentImageIndex = computed(() => Math.max(0, galleryImages.value.indexOf(selectedImage.value)))
function previousImage() {
  if (!galleryImages.value.length) return
  const index = (currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
  selectedImage.value = galleryImages.value[index]
}
function nextImage() {
  if (!galleryImages.value.length) return
  const index = (currentImageIndex.value + 1) % galleryImages.value.length
  selectedImage.value = galleryImages.value[index]
}

const detailRows = computed(() => [
  { label: 'Đăng ký lần đầu', raw: car.value?.firstRegistration },
  { label: 'Số km đã đi', raw: car.value?.mileage, format: km },
  { label: 'Loại nhiên liệu', raw: car.value?.fuelType || car.value?.engineType },
  { label: 'Dung tích động cơ', raw: car.value?.engineCapacity },
  { label: 'Công suất', raw: car.value?.horsepower, format: (value) => `${value} HP` },
  { label: 'Mô-men xoắn', raw: car.value?.torque },
  { label: 'Tiêu hao nhiên liệu', raw: car.value?.fuelConsumption },
  { label: 'Hộp số', raw: car.value?.transmission },
  { label: 'Hệ dẫn động', raw: car.value?.drivetrain },
  { label: 'Loại xe', raw: car.value?.bodyType },
  { label: 'Số chỗ ngồi', raw: car.value?.seats },
  { label: 'Màu ngoại thất', raw: car.value?.color },
  { label: 'Màu nội thất', raw: car.value?.interiorColor },
  { label: 'Năm sản xuất', raw: car.value?.year },
  { label: 'Tồn kho', raw: car.value?.stock },
  { label: 'Bảo hành', raw: car.value?.warranty },
].filter((item) => hasData(item.raw))
  .map((item) => ({ label: item.label, value: item.format ? item.format(item.raw) : item.raw })))

async function loadData() {
  car.value = null
  serverImages.value = []
  selectedImage.value = ''
  message.value = ''
  loadError.value = ''

  try {
    const carId = String(route.params.id)
    const detailResponse = await carApi.getById(carId)
    if (!detailResponse.data?.success || !detailResponse.data?.data) {
      throw new Error(detailResponse.data?.message || 'Không tìm thấy xe')
    }
    car.value = detailResponse.data.data

    const [listResult, similarResult, imagesResult] = await Promise.allSettled([
      carApi.getAll(),
      carApi.getSimilar(carId),
      carApi.getImages(carId),
    ])

    if (listResult.status === 'fulfilled') {
      const data = listResult.value.data
      cars.value = Array.isArray(data) ? data : (data.data || [])
    } else {
      cars.value = []
      console.error('Không thể tải danh sách xe:', listResult.reason)
    }

    if (similarResult.status === 'fulfilled') {
      const data = similarResult.value.data
      similarCars.value = Array.isArray(data) ? data : (data.data || [])
    } else {
      similarCars.value = []
      console.error('Không thể tải xe tương tự:', similarResult.reason)
    }

    if (imagesResult.status === 'fulfilled') {
      const data = imagesResult.value.data
      serverImages.value = Array.isArray(data) ? data : (data.data || [])
    } else {
      serverImages.value = []
      console.error('Không thể tải thư viện ảnh, dùng ảnh chính của xe:', imagesResult.reason)
    }

    selectedImage.value = galleryImages.value[0] || carImageUrl(car.value?.image)
  } catch (error) {
    car.value = null
    loadError.value = error.response?.data?.message || error.message || 'Không thể tải thông tin xe'
    success.value = false
    console.error('Không thể tải thông tin xe:', error)
  }
}

onMounted(loadData)
watch(() => route.params.id, loadData)

function toggleCurrent() {
  if (!has(car.value.id) && count.value >= 3) {
    alert('Chỉ được so sánh tối đa 3 xe.')
    return
  }
  toggle(car.value.id)
}

async function addById(id) {
  const target = id === car.value?.id
    ? car.value
    : similarCars.value.find((item) => item.id === id)
  if (!target || Number(target.stock || 0) <= 0) {
    message.value = 'Xe đã hết hàng, không thể thêm vào giỏ'
    success.value = false
    return
  }
  try {
    const { data } = await cartApi.add(id)
    success.value = Boolean(data.success)
    message.value = data.success ? 'Đã thêm xe vào giỏ hàng' : (data.message || 'Không thể thêm vào giỏ hàng')
  } catch (error) {
    message.value = error.response?.data?.message || 'Không thể thêm vào giỏ hàng'
    success.value = false
  }
}

const addToCart = () => addById(car.value.id)

async function requestQuotation() {
  try {
    const { data } = await quotationApi.create({ carId: car.value.id })
    if (data.success) router.push(`/quotations/${data.data.id}`)
  } catch (error) {
    success.value = false
    message.value = error.response?.data?.message || 'Không thể tạo yêu cầu báo giá'
  }
}

async function loadReviews() {
  const { data } = await reviewApi.getByCar(route.params.id)
  reviews.value = data.data || []
  reviewAverage.value = Number(data.average || 0)
}

async function submitReview() {
  reviewSubmitting.value = true
  reviewMessage.value = ''
  try {
    if (editingReviewId.value) await reviewApi.update(editingReviewId.value, reviewForm.value)
    else await reviewApi.create(car.value.id, reviewForm.value)
    reviewOk.value = true
    reviewMessage.value = editingReviewId.value ? 'Đã cập nhật đánh giá.' : 'Cảm ơn bạn đã đánh giá.'
    editingReviewId.value = null
    reviewForm.value = { rating: 0, comment: '' }
    await loadReviews()
  } catch (error) {
    reviewOk.value = false
    reviewMessage.value = error.response?.data?.message || 'Không thể gửi đánh giá'
  } finally {
    reviewSubmitting.value = false
  }
}

function isOwnReview(review) {
  return Boolean(auth.user?.username && review.username === auth.user.username)
}

function startReviewEdit(review) {
  editingReviewId.value = review.id
  reviewForm.value = { rating: review.rating, comment: review.comment }
}

function cancelReviewEdit() {
  editingReviewId.value = null
  reviewForm.value = { rating: 0, comment: '' }
}

async function deleteReview(review) {
  if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return
  try {
    await reviewApi.delete(review.id)
    cancelReviewEdit()
    reviewOk.value = true
    reviewMessage.value = 'Đã xóa đánh giá.'
    await loadReviews()
  } catch (error) {
    reviewOk.value = false
    reviewMessage.value = error.response?.data?.message || 'Không thể xóa đánh giá'
  }
}

loadReviews().catch(() => {})
</script>

<style scoped>
.review-summary{display:flex;align-items:baseline;gap:14px;margin-bottom:22px}.review-summary strong{color:#b91c1c;font-size:2rem}.review-summary span{color:#6b7280}.review-form{display:grid;gap:12px;max-width:620px}.review-form .form-select,.review-form .form-control{background:#fff;color:#111827;border-color:#d1d5db}.review-list{display:grid;gap:14px;margin-top:24px}.review-item{display:flex;gap:14px;border-top:1px solid #e5e7eb;padding-top:16px}.review-content{flex:1}.review-actions{display:flex;gap:8px;align-items:center}.review-avatar{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:50%;background:#fee2e2;color:#991b1b;font-weight:800}.review-stars{color:#f59e0b}.review-item p{margin:5px 0}.review-item small{color:#6b7280}
.detail-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.detail-container {
  width: min(100%, 1560px);
  max-width: 1560px;
  margin-inline: auto;
  padding-inline: 18px;
}

.detail-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.62fr) minmax(410px, 0.98fr);
  gap: 16px;
  align-items: start;
}

.gallery-card,
.summary-card,
.feature-card,
.inspection {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.06);
}

.gallery-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 16px;
  overflow: hidden;
  height: fit-content;
  min-height: 0;
  align-self: start;
}

.main-image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: #ececec;
}

.main-image {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.thumbnail-row {
  display: flex;
  gap: 14px;
  margin-top: 16px;
  overflow-x: auto;
  padding: 2px 2px 6px;
  scrollbar-width: thin;
}

.thumbnail-button {
  flex: 0 0 166px;
  height: 112px;
  padding: 0;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
}

.thumbnail-button.active {
  border-color: #e51c2a;
}

.thumbnail-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 34px;
}

.eyebrow,
.section-heading span {
  color: #d71920;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.summary-card h1 {
  margin: 12px 0 16px;
  color: #111827;
  font-size: clamp(40px, 4vw, 60px);
  font-weight: 700;
  line-height: 1.05;
}

.summary-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.summary-meta span {
  padding: 10px 15px;
  border-radius: 7px;
  background: #f1f1f1;
  color: #1f2937;
  font-size: 18px;
}

.price {
  margin: 30px 0 28px;
  color: #d71920;
  font-size: clamp(36px, 3.7vw, 54px);
  font-weight: 900;
  line-height: 1.05;
  white-space: nowrap;
}

.price small {
  font-size: 21px;
}

.quick-specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.quick-specs div {
  display: flex;
  min-height: 100px;
  flex-direction: column;
  justify-content: center;
  padding: 18px 20px;
  border-radius: 12px;
  background: #f4f4f4;
}

.quick-specs small {
  margin-bottom: 5px;
  color: #4b5563;
  font-size: 17px;
}

.quick-specs strong {
  color: #111827;
  font-size: 23px;
}

.action-grid {
  display: grid;
  gap: 14px;
  margin-top: 28px;
}

.action-grid > * {
  width: 100%;
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  border-radius: 999px;
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
}

.hero-action .action-icon {
  display: inline-flex;
  width: 28px;
  justify-content: center;
  font-size: 25px;
  line-height: 1;
}

.dealer-box {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 16px;
  margin-top: 26px;
  padding: 24px;
  background: #fafafa;
}

.dealer-icon {
  color: #d71920;
  font-size: 38px;
  line-height: 1;
}

.dealer-box > div {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #1f2937;
  font-size: 18px;
}

.dealer-box strong {
  font-size: 22px;
}

.alert {
  margin-top: 18px;
}

.detail-section {
  margin-top: 46px;
}

.section-heading h2 {
  margin-top: 6px;
  font-size: 32px;
}

.description {
  font-size: 17px;
  line-height: 1.8;
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
}

.spec-item {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 18px 22px;
  border-bottom: 1px solid #e8e8e8;
}

.spec-item:nth-child(4n + 1),
.spec-item:nth-child(4n + 2) {
  background: #f0f0f0;
}

.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.feature-card {
  padding: 25px;
}

.feature-card ul {
  display: grid;
  gap: 10px;
  margin: 15px 0 0;
  padding: 0;
  list-style: none;
}

.inspection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 28px;
}

.inspection-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.inspection-list span {
  padding: 12px;
  border-radius: 8px;
  background: #eef7ee;
  font-weight: 700;
}

.similar-cars-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 2px 14px;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
}

.similar-cars-row::-webkit-scrollbar {
  height: 8px;
}

.similar-cars-row::-webkit-scrollbar-track {
  border-radius: 999px;
  background: #ececec;
}

.similar-cars-row::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: #bdbdbd;
}

.similar-car-item {
  flex: 0 0 320px;
  min-width: 0;
  scroll-snap-align: start;
}

.similar-car-item :deep(.car-card) {
  height: 100%;
}

@media (max-width: 1200px) {
  .detail-container {
    max-width: 1120px;
  }

  .detail-hero {
    grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.9fr);
  }

  .summary-card {
    padding: 26px;
  }

  .summary-card h1 {
    font-size: 42px;
  }

  .price {
    font-size: 38px;
  }

  .summary-meta span,
  .quick-specs small,
  .dealer-box > div {
    font-size: 15px;
  }

  .quick-specs strong {
    font-size: 19px;
  }

  .action-grid > * {
    min-height: 54px;
    font-size: 16px;
  }
}

@media (max-width: 900px) {
  .detail-hero,
  .two-columns,
  .inspection {
    grid-template-columns: 1fr;
  }

  .gallery-card,
  .summary-card {
    width: 100%;
  }

  .main-image {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 600px) {
  .detail-container {
    padding-inline: 10px;
  }

  .gallery-card {
    padding: 10px;
  }

  .summary-card {
    padding: 22px;
  }

  .summary-card h1 {
    font-size: 34px;
  }

  .price {
    font-size: 30px;
    white-space: normal;
  }

  .quick-specs {
    gap: 8px;
  }

  .quick-specs div {
    min-height: 82px;
    padding: 13px;
  }

  .action-grid > * {
    min-height: 50px;
    font-size: 15px;
  }

  .thumbnail-button {
    flex-basis: 110px;
    height: 75px;
  }

  .spec-grid {
    grid-template-columns: 1fr;
  }

  .spec-item:nth-child(odd) {
    background: #f0f0f0;
  }

  .spec-item:nth-child(even) {
    background: #fff;
  }

  .inspection-list {
    grid-template-columns: 1fr;
  }

  .similar-car-item {
    flex-basis: 85vw;
  }
}

.gallery-arrow { position:absolute; top:50%; transform:translateY(-50%); width:50px; height:50px; border:0; border-radius:50%; background:rgba(255,255,255,.92); color:#111827; font-size:38px; line-height:1; cursor:pointer; box-shadow:0 4px 16px rgba(0,0,0,.18); z-index:2; }
.gallery-arrow:hover { background:#fff; color:#d71920; }
.gallery-arrow-left { left:16px; }
.gallery-arrow-right { right:16px; }
</style>
