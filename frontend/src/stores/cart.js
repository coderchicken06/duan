import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cartApi } from '../api'

export const useCartStore = defineStore('cart', () => {
  const itemCount = ref(0)

  function setItems(items) {
    itemCount.value = (Array.isArray(items) ? items : [])
      .reduce((sum, item) => sum + Number(item.quantity || 0), 0)
  }

  async function refresh() {
    try {
      const { data } = await cartApi.get()
      setItems(data.items)
      return data
    } catch {
      return null
    }
  }

  function reset() {
    itemCount.value = 0
  }

  return { itemCount, refresh, reset, setItems }
})
