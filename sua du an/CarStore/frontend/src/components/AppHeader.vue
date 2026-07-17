<template>
  <header class="ford-header">
    <div class="ford-header-inner">
      <nav class="ford-nav-left">
        <router-link class="ford-brand-mark" to="/">CarStore</router-link>
        <router-link to="/car/list">Sản phẩm</router-link>
        <router-link to="/cart/view">Mua xe</router-link>
        <router-link to="/service">Dịch vụ</router-link>
        <router-link to="/support">Hỗ trợ</router-link>
      </nav>

      <router-link class="ford-logo" to="/">CarStore</router-link>

      <div class="ford-nav-right">
        <button
          v-if="showSearch"
          type="button"
          class="ford-icon-btn"
          title="Tìm kiếm"
          @click="searchOpen = !searchOpen"
        >
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>

        <router-link v-if="!auth.isLoggedIn" to="/login" class="ford-icon-btn" title="Đăng nhập">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </router-link>

        <details v-if="auth.isUser" class="role-dropdown">
          <summary class="ford-icon-btn" title="Lịch sử">
            <svg viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 1 0 3-6.7"/>
              <polyline points="3 3 3 9 9 9"/><polyline points="12 7 12 12 16 14"/>
            </svg>
          </summary>
          <div class="role-menu-panel">
            <router-link to="/order/my-orders">📦 Lịch sử đơn hàng</router-link>
            <router-link to="/history">📋 Lịch sử yêu cầu</router-link>
          </div>
        </details>

        <details v-if="auth.isAdmin" class="role-dropdown">
          <summary class="ford-icon-btn" title="Quản lý">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </summary>
          <div class="role-menu-panel">
            <router-link to="/admin/dashboard">📊 Thống kê</router-link>
            <router-link to="/admin/inventory">🚗 Quản lý tồn kho</router-link>
            <router-link to="/admin/orders">📦 Quản lý đơn hàng</router-link>
            <router-link to="/admin/support">📋 Quản lý yêu cầu</router-link>
            <router-link to="/admin/users">👥 Quản lý khách hàng</router-link>
            <router-link to="/car/create">➕ Thêm xe mới</router-link>
          </div>
        </details>

        <router-link v-if="auth.isLoggedIn" to="/profile" class="ford-icon-btn" title="Profile">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </router-link>

        <button v-if="auth.isLoggedIn" type="button" class="ford-icon-btn" title="Đăng xuất" @click="handleLogout">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="showSearch" class="ford-search-row" :class="{ 'is-open': searchOpen }">
      <form class="ford-search-form" @submit.prevent="doSearch">
        <input v-model="searchQuery" type="search" placeholder="Tìm kiếm tên xe..." autocomplete="off" />
        <button type="submit">Tìm</button>
      </form>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const searchOpen = ref(false)
const searchQuery = ref(route.query.q || '')

const showSearch = computed(() => ['home', 'car-list'].includes(route.name))

async function handleLogout() {
  await auth.logout()
  router.push('/')
}

function doSearch() {
  router.push({ name: 'car-list', query: searchQuery.value ? { q: searchQuery.value } : {} })
  searchOpen.value = false
}
</script>
