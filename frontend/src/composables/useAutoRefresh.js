import { onBeforeUnmount, onMounted } from 'vue'

export function useAutoRefresh(refresh, intervalMs = 2000) {
  let timer = null
  let refreshing = false

  async function run() {
    if (refreshing || document.hidden) return
    refreshing = true
    try {
      await refresh()
    } catch {
      // Giữ dữ liệu gần nhất nếu một lượt đồng bộ tạm thời mất kết nối.
    } finally {
      refreshing = false
    }
  }

  function refreshWhenVisible() {
    if (!document.hidden) run()
  }

  onMounted(() => {
    if (intervalMs > 0) timer = window.setInterval(run, intervalMs)
    window.addEventListener('focus', run)
    document.addEventListener('visibilitychange', refreshWhenVisible)
  })

  onBeforeUnmount(() => {
    if (timer) window.clearInterval(timer)
    window.removeEventListener('focus', run)
    document.removeEventListener('visibilitychange', refreshWhenVisible)
  })
}
