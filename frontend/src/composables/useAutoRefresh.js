import { onBeforeUnmount, onMounted } from 'vue'

const SYNC_CHANNEL = 'carstore_sync'
const MIN_REFRESH_INTERVAL_MS = 800

export function notifyDataUpdated() {
  if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return

  const channel = new BroadcastChannel(SYNC_CHANNEL)
  channel.postMessage({ type: 'DATA_UPDATED' })
  channel.close()
}

export function useAutoRefresh(refresh) {
  let refreshing = false
  let channel = null
  let scheduledRefresh = null
  let lastRefreshAt = 0
  let pendingBroadcastRefresh = false

  async function run({ bypassThrottle = false } = {}) {
    if (document.hidden) return
    if (refreshing) {
      pendingBroadcastRefresh ||= bypassThrottle
      return
    }

    const remainingDelay = bypassThrottle ? 0 : MIN_REFRESH_INTERVAL_MS - (Date.now() - lastRefreshAt)
    if (remainingDelay > 0) {
      if (!scheduledRefresh) {
        scheduledRefresh = window.setTimeout(() => {
          scheduledRefresh = null
          run()
        }, remainingDelay)
      }
      return
    }

    refreshing = true
    lastRefreshAt = Date.now()
    try {
      await refresh()
    } catch {
      // Giữ dữ liệu gần nhất nếu một lượt đồng bộ tạm thời mất kết nối.
    } finally {
      refreshing = false
      if (pendingBroadcastRefresh) {
        pendingBroadcastRefresh = false
        run({ bypassThrottle: true })
      }
    }
  }

  function refreshWhenVisible() {
    if (!document.hidden) run()
  }

  onMounted(() => {
    window.addEventListener('focus', run)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL)
      channel.addEventListener('message', (event) => {
        if (event.data?.type === 'DATA_UPDATED') {
          run({ bypassThrottle: true })
        }
      })
    }
  })

  onBeforeUnmount(() => {
    if (scheduledRefresh) window.clearTimeout(scheduledRefresh)
    window.removeEventListener('focus', run)
    document.removeEventListener('visibilitychange', refreshWhenVisible)
    channel?.close()
  })
}
