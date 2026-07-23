<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">{{ isEdit ? 'Sửa xe' : 'Thêm xe mới' }}</h2>
      <form class="vstack gap-3" @submit.prevent="submit">
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label">Tên xe</label><input v-model="form.name" class="form-control" required /></div>
          <div class="col-md-6"><label class="form-label">Giá (VNĐ)</label><input v-model.number="form.price" type="number" class="form-control" required /></div>
          <div class="col-md-4"><label class="form-label">Brand ID</label><input v-model.number="form.brandId" type="number" class="form-control" required /></div>
          <div class="col-md-4"><label class="form-label">Năm</label><input v-model.number="form.year" type="number" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Màu</label><input v-model="form.color" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Tồn kho</label><input v-model.number="form.stock" type="number" class="form-control" min="0" /></div>
          <div class="col-md-4"><label class="form-label">Đăng ký lần đầu</label><input v-model="form.firstRegistration" class="form-control" placeholder="Tháng 11 Năm 2023" /></div>
          <div class="col-md-4"><label class="form-label">Số km đã đi</label><input v-model.number="form.mileage" type="number" min="0" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Loại động cơ</label><input v-model="form.engineType" class="form-control" placeholder="Xăng" /></div>
          <div class="col-md-4"><label class="form-label">Dung tích động cơ</label><input v-model="form.engineCapacity" class="form-control" placeholder="1.5L Turbo" /></div>
          <div class="col-md-4"><label class="form-label">Màu nội thất</label><input v-model="form.interiorColor" class="form-control" placeholder="Đen" /></div>
          <div class="col-md-4"><label class="form-label">Loại xe</label><input v-model="form.bodyType" class="form-control" placeholder="SUV" /></div>
          <div class="col-md-4"><label class="form-label">Số chỗ ngồi</label><input v-model.number="form.seats" type="number" min="1" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Hệ dẫn động</label><input v-model="form.drivetrain" class="form-control" placeholder="FWD" /></div>
          <div class="col-md-4"><label class="form-label">Hộp số</label><input v-model="form.transmission" class="form-control" placeholder="CVT" /></div>
          <div class="col-md-4"><label class="form-label">Công suất (HP)</label><input v-model.number="form.horsepower" type="number" min="0" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Mô-men xoắn</label><input v-model="form.torque" class="form-control" placeholder="240 Nm" /></div>
          <div class="col-md-4"><label class="form-label">Nhiên liệu</label><input v-model="form.fuelType" class="form-control" placeholder="Xăng" /></div>
          <div class="col-md-4"><label class="form-label">Tiêu hao nhiên liệu</label><input v-model="form.fuelConsumption" class="form-control" placeholder="6.8 L/100km" /></div>
          <div class="col-md-4"><label class="form-label">Bảo hành</label><input v-model="form.warranty" class="form-control" placeholder="12 tháng hoặc 20.000 km" /></div>
          <div class="col-md-4"><label class="form-label">Mức kiểm định</label><input v-model="form.inspectionLevel" class="form-control" placeholder="CarStore Certified" /></div>
          <div class="col-md-6"><label class="form-label">Tên đại lý</label><input v-model="form.dealerName" class="form-control" /></div>
          <div class="col-md-6"><label class="form-label">Địa chỉ đại lý</label><input v-model="form.dealerAddress" class="form-control" /></div>
          <div class="col-12"><label class="form-label">Ghi chú kiểm định</label><textarea v-model="form.inspectionNote" class="form-control" rows="2"></textarea></div>
          <div class="col-md-6"><label class="form-label">Trang bị an toàn</label><textarea v-model="form.safetyFeatures" class="form-control" rows="3" placeholder="ABS, cân bằng điện tử, camera lùi"></textarea></div>
          <div class="col-md-6"><label class="form-label">Tiện nghi</label><textarea v-model="form.comfortFeatures" class="form-control" rows="3" placeholder="Điều hòa, màn hình, Apple CarPlay"></textarea></div>
          <div class="col-md-8"><label class="form-label">Ảnh</label>
            <div class="d-flex gap-2">
              <input v-model="form.image" class="form-control" placeholder="tên file ảnh" />
              <input type="file" accept="image/*" @change="onFileChange" class="form-control" />
            </div>
          </div>
          <div class="col-12">
            <label class="form-label fw-bold">Thư viện ảnh của xe</label>
            <div class="d-flex gap-2 mb-3">
              <input type="file" multiple accept="image/*" class="form-control" @change="onGalleryFiles" />
            </div>
            <div v-if="galleryImages.length" class="row g-3">
              <div v-for="(item, index) in galleryImages" :key="item.id || item.imageUrl" class="col-md-3">
                <div class="border rounded p-2 h-100">
                  <img :src="carImageUrl(item.imageUrl)" class="w-100 rounded mb-2" style="height:120px;object-fit:cover" />
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <input v-model.number="item.sortOrder" type="number" min="0" class="form-control form-control-sm" title="Thứ tự" />
                    <label class="small text-nowrap">
                      <input type="radio" name="primary-gallery-image"
                        :checked="item.primaryImage" @change="selectPrimary(index)" /> Ảnh chính
                    </label>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="removeGalleryImage(item, index)">Xóa ảnh</button>
                </div>
              </div>
            </div>
            <small class="text-muted">Lưu xe trước, sau đó có thể tải nhiều ảnh. Ảnh được lưu trong bảng CarImage.</small>
          </div>
          <div class="col-12"><label class="form-label">Mô tả</label><textarea v-model="form.description" class="form-control" rows="4"></textarea></div>
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div class="d-flex gap-2">
          <button type="submit" class="btn cs-btn cs-btn-primary">Lưu</button>
          <router-link class="btn cs-btn cs-btn-ghost" to="/admin/inventory">Hủy</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, adminApi, uploadApi, carImageUrl } from '../api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const error = ref('')
const galleryImages = ref([])
const form = ref({ name: '', price: null, brandId: null, year: null, color: '', stock: 0, image: '', description: '', firstRegistration: '', mileage: null, engineType: '', engineCapacity: '', interiorColor: '', bodyType: '', seats: null, drivetrain: '', transmission: '', horsepower: null, torque: '', fuelType: '', fuelConsumption: '', warranty: '', dealerName: '', dealerAddress: '', inspectionLevel: '', inspectionNote: '', safetyFeatures: '', comfortFeatures: '' })
const carFields = [
  'name', 'price', 'brandId', 'year', 'color', 'stock', 'image', 'description',
  'firstRegistration', 'mileage', 'engineType', 'engineCapacity', 'interiorColor',
  'bodyType', 'seats', 'drivetrain', 'transmission', 'horsepower', 'torque',
  'fuelType', 'fuelConsumption', 'warranty', 'dealerName', 'dealerAddress',
  'inspectionLevel', 'inspectionNote', 'safetyFeatures', 'comfortFeatures',
]

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await carApi.getById(String(route.params.id))
    form.value = { ...(data.data || data) }
    const images = await carApi.getImages(String(route.params.id))
    galleryImages.value = Array.isArray(images.data) ? images.data : (images.data.data || [])
    const primaryIndex = galleryImages.value.findIndex((item) => item.primaryImage)
    if (galleryImages.value.length) selectPrimary(primaryIndex >= 0 ? primaryIndex : 0)
  }
})

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const { data } = await uploadApi.upload(file)
  form.value.image = data
}

async function onGalleryFiles(e) {
  const files = Array.from(e.target.files || []) as File[]
  for (const file of files) {
    const { data } = await uploadApi.upload(file)
    galleryImages.value.push({ imageUrl: data, sortOrder: galleryImages.value.length, primaryImage: galleryImages.value.length === 0 })
  }
  e.target.value = ''
}

async function removeGalleryImage(item, index) {
  if (item.id && isEdit.value) {
    await carApi.deleteImage(String(route.params.id), item.id)
    const images = await carApi.getImages(String(route.params.id))
    galleryImages.value = Array.isArray(images.data) ? images.data : (images.data.data || [])
    return
  }
  const wasPrimary = item.primaryImage
  galleryImages.value.splice(index, 1)
  if (wasPrimary && galleryImages.value.length) selectPrimary(0)
}

function selectPrimary(index) {
  galleryImages.value.forEach((item, itemIndex) => {
    item.primaryImage = itemIndex === index
  })
}

async function saveGallery(carId) {
  for (let index = 0; index < galleryImages.value.length; index++) {
    const item = galleryImages.value[index]
    const payload = { imageUrl: item.imageUrl, sortOrder: item.sortOrder ?? index, primaryImage: !!item.primaryImage }
    if (item.id) await carApi.updateImage(carId, item.id, payload)
    else await carApi.addImage(carId, payload)
  }
}

async function submit() {
  error.value = ''
  try {
    const payload = Object.fromEntries(carFields.map((field) => [field, form.value[field]]))
    const res = isEdit.value
      ? await adminApi.updateCar(String(route.params.id), payload)
      : await adminApi.createCar(payload)
    if (res.data.success === false) {
      error.value = res.data.message
      return
    }
    const savedCar = res.data.data || res.data
    const carId = route.params.id || savedCar.id
    if (carId) await saveGallery(carId)
    router.push('/admin/inventory')
  } catch (e) {
    error.value = e.response?.data?.message || 'Lỗi lưu xe'
  }
}
</script>
