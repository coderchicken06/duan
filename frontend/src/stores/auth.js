import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '../api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const normalizedRole = computed(() => String(user.value?.role || '').toUpperCase())
  const isAdmin = computed(() => ['ADMIN', 'ROLE_ADMIN'].includes(normalizedRole.value))
  const isUser = computed(() => ['USER', 'ROLE_USER'].includes(normalizedRole.value))

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

  function updateCurrentUser(updatedUser) {
    if (!user.value || user.value.username !== updatedUser?.username) return
    user.value = { ...user.value, ...updatedUser }
  }

  return { user, loading, isLoggedIn, isAdmin, isUser, fetchUser, login, logout, updateCurrentUser }
})
