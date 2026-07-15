import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'ROLE_ADMIN')
  const isUser = computed(() => user.value?.role === 'ROLE_USER')

  async function fetchUser() {
    loading.value = true
    try {
      const { data } = await authApi.me()
      if (data.success) {
        user.value = data
        return true
      }
      user.value = null
      return false
    } catch {
      user.value = null
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(username, password) {
    const { data } = await authApi.login(username, password)
    if (data.success) {
      user.value = {
        username: data.username,
        fullname: data.fullname,
        email: data.email,
        role: data.role,
        success: true,
      }
    }
    return data
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      user.value = null
    }
  }

  return { user, loading, isLoggedIn, isAdmin, isUser, fetchUser, login, logout }
})
