<template>
  <div class="page-home">
    <div v-if="alert" class="home-cart-alert show">{{ alert }}</div>

    <section class="ford-hero-panel">
      <div class="ford-hero-panel-content">
        <span class="ford-badge">Xe mới • Giá tốt • Bảo hành dài hạn</span>
        <h1>Khám phá phương tiện hoàn hảo cho mọi hành trình</h1>
        <p>Khám phá các mẫu xe mới, đặt lịch xem xe trực tuyến và sở hữu chiếc xe phù hợp nhất với phong cách của bạn.</p>
        <div class="ford-intro-actions">
          <router-link class="ford-btn-primary" to="/car/list">Xem tất cả xe</router-link>
          <router-link class="ford-btn-outline" to="/cart/view">Giỏ hàng của bạn</router-link>
        </div>
      </div>
      <div class="ford-hero-side">
        <div class="ford-hero-stat"><strong>120+</strong><span>mẫu xe đang chờ bạn</span></div>
        <div class="ford-hero-stat"><strong>4.9/5</strong><span>đánh giá khách hàng</span></div>
        <div class="ford-hero-stat"><strong>24/7</strong><span>hỗ trợ đặt lịch</span></div>
      </div>
    </section>

    <div class="ford-section container">
      <div class="ford-section-head">
        <div>
          <h2>Sản phẩm nổi bật</h2>
          <div v-if="q" class="ford-section-meta">
            Tìm kiếm: “<span class="text-primary fw-bold">{{ q }}</span>” ·
            <router-link to="/" class="text-decoration-none">Xóa bộ lọc</router-link>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="car in cars" :key="car.id" class="col-12 col-md-6 col-lg-4">
          <CarCard :car="car" @add-cart="addToCart" />
        </div>
      </div>
      <div v-if="loadError" class="ford-api-error" role="alert">
        {{ loadError }}
        <button type="button" @click="loadCars">Thử lại</button>
      </div>
      <p v-if="!loading && !loadError && cars.length === 0" class="ford-empty-state">Không tìm thấy xe nào.</p>
    </div>
    <section v-if="news.length" class="ford-section container"><div class="ford-section-head"><h2>Tin tức mới</h2></div><div class="row g-4"><div v-for="item in news" :key="item.id" class="col-12 col-md-4"><article class="news-card"><img v-if="item.thumbnail" :src="carImageUrl(item.thumbnail)" :alt="item.title"><div><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><router-link :to="`/news/${item.slug}`">Đọc tiếp</router-link></div></article></div></div></section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { carApi, cartApi, newsApi, carImageUrl } from '../api'
import CarCard from '../components/CarCard.vue'

const route = useRoute()
const cars = ref([])
const loading = ref(true)
const loadError = ref('')
const news = ref([])
const alert = ref('')
const q = ref(route.query.q || '')
const videoSrc = '/videos/ford-intro.mp4'

onMounted(async()=>{await loadCars();try{const{data}=await newsApi.getPublished();news.value=(data.data||[]).slice(0,3)}catch{news.value=[]}})

async function loadCars() {
  loading.value = true
  loadError.value = ''
  try {
    const { data } = await carApi.getAll(String(q.value || '') || undefined)
    cars.value = Array.isArray(data) ? data : data.data || []
  } catch (error) {
    cars.value = []
    loadError.value = error.response?.data?.message
      || 'Không thể kết nối cơ sở dữ liệu sản phẩm. Vui lòng kiểm tra backend rồi thử lại.'
  } finally {
    loading.value = false
  }
}

async function addToCart(id) {
  const { data } = await cartApi.add(id)
  if (data.success) {
    alert.value = 'Thêm giỏ hàng thành công'
    setTimeout(() => (alert.value = ''), 2500)
  } else {
    alert.value = data.message || 'Không thể thêm vào giỏ'
  }
}
</script>
<style scoped>.news-card{height:100%;overflow:hidden;border:1px solid #e5e7eb;border-radius:14px;background:#fff}.news-card img{width:100%;height:180px;object-fit:cover}.news-card div{padding:18px}.news-card h3{font-size:1.1rem;font-weight:800}.news-card p{color:#6b7280}.ford-api-error{margin:24px 0;padding:14px 16px;border:1px solid #fecaca;border-radius:12px;background:#fef2f2;color:#991b1b;text-align:center}.ford-api-error button{margin-left:12px;border:0;border-radius:999px;padding:7px 14px;background:#991b1b;color:#fff;font-weight:700}</style>
