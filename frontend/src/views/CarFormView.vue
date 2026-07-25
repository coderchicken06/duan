<template>
  <div class="container cs-container py-5">
    <div class="cs-card p-4">
      <h2 class="cs-page-title mb-4">{{ isEdit ? 'Sửa xe' : 'Thêm xe mới' }}</h2>
      <form class="vstack gap-3" @submit.prevent="submit">
        <div class="row g-3">
          <div class="col-md-6"><label class="form-label">Tên xe</label><input v-model="form.name" class="form-control" required /></div>
          <div class="col-md-6"><label class="form-label">Giá (VNĐ)</label><input v-model.number="form.price" type="number" class="form-control" required /></div>
          <div class="col-md-4"><label class="form-label">Brand ID</label><input v-model.number="form.brandId" type="number" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Năm</label><input v-model.number="form.year" type="number" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Màu</label><input v-model="form.color" class="form-control" /></div>
          <div class="col-md-4"><label class="form-label">Tồn kho</label><input v-model.number="form.stock" type="number" class="form-control" min="0" /></div>
          <div class="col-md-8"><label class="form-label">Ảnh</label>
            <div class="d-flex gap-2">
              <input v-model="form.image" class="form-control" placeholder="tên file ảnh" />
              <input type="file" accept="image/*" @change="onFileChange" class="form-control" />
            </div>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { carApi, adminApi, uploadApi } from '../api'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const error = ref('')
const form = ref({ name: '', price: 0, brandId: 1, year: 2024, color: '', stock: 0, image: '', description: '' })

onMounted(async () => {
  if (isEdit.value) {
    const { data } = await carApi.getById(route.params.id)
    form.value = { ...(data.data || data) }
  }
})

async function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const { data } = await uploadApi.upload(file)
  form.value.image = data
}

async function submit() {
  error.value = ''
  try {
    const payload = { ...form.value }
    const res = isEdit.value
      ? await adminApi.updateCar(route.params.id, payload)
      : await adminApi.createCar(payload)
    if (res.data.success === false) {
      error.value = res.data.message
      return
    }
    router.push('/admin/inventory')
  } catch (e) {
    error.value = e.response?.data?.message || 'Lỗi lưu xe'
  }
}
</script>
