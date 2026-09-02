<template>
  <header ref="header" class="ford-header" :class="{ 'is-admin-header': auth.isAdmin }">
    <div class="ford-header-inner">
      <nav v-if="!auth.isAdmin" class="ford-nav-left" aria-label="Điều hướng khách hàng">
        <router-link to="/news">Tin tức</router-link>
        <router-link to="/cars">Sản phẩm</router-link>
        <router-link class="cart-nav-link" to="/cart/view">
          Đặt cọc xe
          <span v-if="cart.itemCount > 0" class="cart-nav-count" aria-label="Số lượng xe chờ đặt cọc">
            {{ cart.itemCount }}
          </span>
        </router-link>
        <router-link to="/service">Dịch vụ</router-link>
        <router-link to="/support">Hỗ trợ</router-link>
      </nav>
      <div v-if="auth.isAdmin" class="admin-header-spacer" aria-hidden="true"></div>
      <router-link class="ford-logo" :to="auth.isAdmin ? '/admin/dashboard' : '/'"
        :aria-label="auth.isAdmin ? 'CarStore - Trang quản trị' : 'CarStore - Trang chủ'">CarStore</router-link>

      <div class="ford-nav-right">
        <button v-if="showSearch && !auth.isAdmin" type="button" class="ford-icon-btn" title="Tìm kiếm" aria-label="Mở ô tìm kiếm"
          :aria-expanded="searchOpen" @click="searchOpen = !searchOpen">
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <router-link v-if="!auth.isLoggedIn" to="/login" class="ford-icon-btn" title="Đăng nhập" aria-label="Đăng nhập">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </router-link>

        <details v-if="auth.isUser" class="role-dropdown" ref="userMenuDetails">
          <summary class="ford-icon-btn" title="Lịch sử" aria-label="Mở menu lịch sử">
            <svg viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 1 0 3-6.7" />
              <polyline points="3 3 3 9 9 9" />
              <polyline points="12 7 12 12 16 14" />
            </svg>
          </summary>
          <div class="role-menu-panel">
            <router-link to="/my-orders" @click="closeUserMenu">📦 Lịch sử đơn hàng</router-link>
            <router-link to="/quotation-history" @click="closeUserMenu">📋 Xem Lịch sử yêu cầu báo giá</router-link>
            <router-link to="/history" @click="closeUserMenu">📋 Lịch sử yêu cầu hỗ trợ</router-link>
          </div>
        </details>

        <router-link v-if="auth.isLoggedIn" to="/profile" class="ford-icon-btn" title="Hồ sơ"
          aria-label="Hồ sơ cá nhân">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </router-link>

        <button v-if="auth.isLoggedIn" type="button" class="ford-icon-btn" title="Đăng xuất" aria-label="Đăng xuất"
          @click="handleLogout">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="showSearch && !auth.isAdmin" class="ford-search-row" :class="{ 'is-open': searchOpen }">
      <form class="ford-search-form" @submit.prevent="doSearch">
        <div class="search-input-wrapper">
          <input v-model="searchQuery" type="search" aria-label="Tên xe cần tìm" placeholder="Tìm kiếm tên xe..."
            autocomplete="off" @focus="showCachedSuggestions" @input="handleSearchInput" />
          <div v-if="showDropdown && suggestions.length" class="search-suggestions" role="listbox">
            <button v-for="item in suggestions" :key="item.id" class="search-suggestion" type="button" role="option"
              @click="selectSuggestion(item)">
              <img :src="carImageUrl(item.mainImageUrl)" alt="" @error="useDefaultCarImage" />
              <span class="search-suggestion-info"><strong>{{ item.carName }}</strong><small>{{ item.brandName
                  }}</small><small v-if="item.fuelType || item.seatCapacity" class="search-suggestion-tags">{{
                    item.fuelType || 'N/A' }}<template v-if="item.seatCapacity"> · {{ item.seatCapacity }}
                    chỗ</template></small></span>
              <span class="search-suggestion-price">{{ formatSuggestionPrice(item.price) }}</span>
            </button>
          </div>
        </div>
        <button type="submit">Tìm</button>
      </form>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api/client'
import { brandApi, carImageUrl, useDefaultCarImage } from '../api'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const auth = useAuthStore()
const cart = useCartStore()
const route = useRoute()
const router = useRouter()
const searchOpen = ref(false)
const searchQuery = ref(String(route.query.q || ''))
const carCache = ref([])
const showDropdown = ref(false)
const header = ref(null)
const showSearch = computed(() => ['home', 'car-list'].includes(String(route.name || '')))
let cacheRequest

// Khai báo ref để tự động đóng menu quản lý/lịch sử khi click chọn hoặc click ra ngoài
const userMenuDetails = ref(null)

function closeUserMenu() {
  if (userMenuDetails.value) {
    userMenuDetails.value.removeAttribute('open')
  }
}

// Cốt lõi xử lý: Đóng menu khi click bất kỳ đâu bên ngoài khung menu
function handleClickOutside(event) {
  if (userMenuDetails.value && !userMenuDetails.value.contains(event.target)) {
    userMenuDetails.value.removeAttribute('open')
  }
  if (header.value && !header.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  cart.refresh()
  loadCarCache()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => route.query.q,
  (query) => {
    searchQuery.value = String(query || '')
  }
)

const normaliseSearch = (value) => String(value || '').toLowerCase().trim()
const vndFormatter = new Intl.NumberFormat('vi-VN')
const formatSuggestionPrice = (value) => `${vndFormatter.format(Number(value || 0))} VNĐ`

function toCachedCar(car, brandNames) {
  return {
    carName: car.carName || car.name || '',
    brandName: car.brandName || brandNames.get(Number(car.brandId)) || '',
    mainImageUrl: car.mainImageUrl || car.imageUrl || car.image || '',
    seatCapacity: car.seatCapacity ?? car.seats ?? '',
    id: car.id,
    price: car.price,
    fuelType: car.fuelType || '',
  }
}

const suggestions = computed(() => {
  const kw = normaliseSearch(searchQuery.value)
  return !kw ? [] : carCache.value.filter((car) => [
    car.carName, car.brandName, car.fuelType,
    car.seatCapacity && `${car.seatCapacity} chỗ`,
  ].some((value) => normaliseSearch(value).includes(kw))).slice(0, 5)
})

function loadCarCache() {
  if (carCache.value.length || cacheRequest) return cacheRequest
  cacheRequest = Promise.all([api.get('/api/cars'), brandApi.getAll()])
    .then(([carsResponse, brandsResponse]) => {
      const cars = Array.isArray(carsResponse.data) ? carsResponse.data : carsResponse.data.data || []
      const brands = Array.isArray(brandsResponse.data) ? brandsResponse.data : brandsResponse.data.data || []
      const brandNames = new Map(brands.map((brand) => [Number(brand.id), brand.name]))
      carCache.value = cars
        .filter((car) => String(car.status || '').toUpperCase() === 'AVAILABLE')
        .map((car) => toCachedCar(car, brandNames))
    })
    .catch(() => { carCache.value = [] })
  return cacheRequest
}

async function showCachedSuggestions() {
  if (!carCache.value.length) await loadCarCache()
  showDropdown.value = Boolean(searchQuery.value.trim())
}

function handleSearchInput() {
  const keyword = searchQuery.value.trim()
  showDropdown.value = Boolean(keyword)

  if (route.name === 'car-list' && String(route.query.q || '') !== keyword) {
    router.replace({
      path: route.path,
      query: { ...route.query, q: keyword || undefined },
    })
  }
}

async function handleLogout() {
  await auth.logout()
  cart.reset()
  router.push('/')
}

function doSearch() {
  const keyword = searchQuery.value.trim()
  router.push({ name: 'car-list', query: keyword ? { q: keyword } : {} })
  searchOpen.value = false
  showDropdown.value = false
}

function selectSuggestion(item) {
  showDropdown.value = false
  searchQuery.value = ''
  searchOpen.value = false
  router.push(`/car/detail/${item.id}`)
}
</script>

<style scoped>
.ford-header-inner {
  height: 72px;
}

.ford-header.is-admin-header .ford-header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  max-width: none;
  padding-inline: 32px;
  width: 100%;
}

.ford-header.is-admin-header .admin-header-spacer {
  grid-column: 1;
}

.ford-header.is-admin-header .ford-logo {
  grid-column: 2;
  margin: 0;
}

.ford-header.is-admin-header .ford-nav-right {
  grid-column: 3;
  justify-self: end;
  margin-left: 0;
}

.ford-nav-left {
  gap: 24px;
}


.ford-nav-left a {
  font-size: 1rem;
}

.ford-logo {
  font-size: 1.5rem;
}

.ford-icon-btn {
  width: 44px;
  height: 44px;
}

.ford-icon-btn svg {
  width: 23px;
  height: 23px;
}

.ford-nav-left a {
  position: relative;
  padding-block: 0.45rem;
}

.cart-nav-link {
  align-items: center;
  display: inline-flex;
  gap: 6px;
}

.cart-nav-count {
  align-items: center;
  background: #b91c1c;
  border-radius: 999px;
  color: #fff;
  display: inline-flex;
  font-size: .72rem;
  font-weight: 800;
  justify-content: center;
  min-height: 20px;
  min-width: 20px;
  padding: 1px 6px;
}

.ford-nav-left a::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #b91c1c;
  border-radius: 999px;
  content: "";
  opacity: 0;
  transform: scaleX(0.4);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.ford-nav-left a.router-link-active {
  color: #b91c1c;
}

.ford-nav-left a.router-link-active::after {
  opacity: 1;
  transform: scaleX(1);
}

.ford-icon-btn:focus-visible,
.ford-nav-left a:focus-visible,
.ford-logo:focus-visible {
  outline: 3px solid rgb(185 28 28 / 28%);
  outline-offset: 3px;
}

.ford-search-row {
  position: relative;
}

.search-input-wrapper {
  min-width: 0;
  position: relative;
  flex: 1;
}

.search-input-wrapper input {
  width: 100%;
}

.search-suggestions {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
  left: 0;
  max-height: 400px;
  min-width: 360px;
  overflow-x: hidden;
  overflow-y: auto;
  position: absolute;
  top: calc(100% + 8px);
  width: 100%;
  z-index: 9999;
}

.search-suggestion {
  align-items: center;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #eee;
  color: #1f2937;
  display: grid;
  gap: .75rem;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  padding: .65rem .85rem;
  text-align: left;
  width: 100%;
}

.search-suggestion:hover {
  background: #f8f8f8;
}

.search-suggestion:last-child {
  border-bottom: 0;
}

.search-suggestion img {
  height: 44px;
  object-fit: cover;
  width: 64px;
}

.search-suggestion-info {
  display: grid;
  min-width: 0;
}

.search-suggestion-info strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-suggestion-info small {
  color: #6b7280;
}

.search-suggestion-info .search-suggestion-tags {
  color: #92400e;
  font-size: .76rem;
}

.search-suggestion-price {
  color: #b91c1c;
  font-size: .9rem;
  font-weight: 800;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .ford-header.is-admin-header .ford-header-inner {
    display: grid;
    height: 64px;
    padding: 0 16px;
  }

  .search-suggestions {
    min-width: min(360px, calc(100vw - 2rem));
  }

  .ford-header-inner {
    grid-template-columns: auto 1fr auto;
    height: auto;
    gap: 0.65rem;
    padding: 0.7rem 1rem 0;
  }

  .ford-logo {
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
  }

  .ford-nav-right {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
  }

  .ford-nav-left {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    justify-content: flex-start;
    gap: 1.1rem;
    overflow-x: auto;
    padding-bottom: 0.45rem;
    scrollbar-width: none;
    white-space: nowrap;
  }

  .ford-nav-left::-webkit-scrollbar {
    display: none;
  }
}
</style>
