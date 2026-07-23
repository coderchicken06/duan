import { computed, ref } from 'vue'

const STORAGE_KEY = 'carstore_compare_ids'
const selectedIds = ref(load())

function load() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value)
      ? [...new Set(value.map(Number).filter((id) => Number.isInteger(id) && id > 0))].slice(0, 3)
      : []
  } catch {
    return []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedIds.value))
}

export function useCompare() {
  const count = computed(() => selectedIds.value.length)
  const has = (id) => selectedIds.value.includes(Number(id))
  const toggle = (id) => {
    const numericId = Number(id)
    if (!Number.isInteger(numericId) || numericId <= 0) return false
    if (has(numericId)) selectedIds.value = selectedIds.value.filter((item) => item !== numericId)
    else if (selectedIds.value.length < 3) selectedIds.value = [...selectedIds.value, numericId]
    save()
    return has(numericId)
  }
  const remove = (id) => {
    selectedIds.value = selectedIds.value.filter((item) => item !== Number(id))
    save()
  }
  const clear = () => {
    selectedIds.value = []
    save()
  }
  return { selectedIds, count, has, toggle, remove, clear }
}
