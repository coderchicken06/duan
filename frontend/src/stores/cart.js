import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cartApi } from '../api'

export const useCartStore = defineStore('cart', () => {
  const itemCount = ref(0)
  const items = ref([])
  const depositItem = ref(readDepositItem())

  if (depositItem.value) {
    items.value = [depositItem.value]
    itemCount.value = 1
  }

  function setItems(nextItems) {
    items.value = Array.isArray(nextItems) ? nextItems : []
    itemCount.value = items.value
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
    items.value = []
    clearDepositItem()
  }

  function clearCart() {
    reset()
  }

  function setDepositItem(item) {
    depositItem.value = { ...item, quantity: 1 }
    items.value = [depositItem.value]
    itemCount.value = 1
    sessionStorage.setItem('carstore.deposit-item', JSON.stringify(depositItem.value))
  }

  function clearDepositItem() {
    depositItem.value = null
    sessionStorage.removeItem('carstore.deposit-item')
  }

  return { itemCount, items, depositItem, refresh, reset, clearCart, setItems, setDepositItem, clearDepositItem }
})

function readDepositItem() {
  try {
    const stored = sessionStorage.getItem('carstore.deposit-item')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
