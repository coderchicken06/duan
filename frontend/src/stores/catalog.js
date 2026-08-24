import { defineStore } from 'pinia'
import { ref } from 'vue'
import { brandApi, carApi } from '../api'

const CACHE_TTL_MS = 60_000

export const useCatalogStore = defineStore('catalog', () => {
  const cars = ref([])
  const brands = ref([])
  const carsLoadedAt = ref(0)
  const brandsLoadedAt = ref(0)
  const carDetails = ref({})
  const detailLoadedAt = ref({})
  let carsRequest = null
  let brandsRequest = null
  const detailRequests = new Map()

  async function loadCars(force = false) {
    if (!force && carsLoadedAt.value && Date.now() - carsLoadedAt.value < CACHE_TTL_MS) {
      return cars.value
    }
    if (carsRequest) return carsRequest

    carsRequest = carApi.getAll()
      .then(({ data }) => {
        cars.value = Array.isArray(data) ? data : data.data || []
        carsLoadedAt.value = Date.now()
        return cars.value
      })
      .finally(() => {
        carsRequest = null
      })
    return carsRequest
  }

  async function loadBrands(force = false) {
    if (!force && brandsLoadedAt.value && Date.now() - brandsLoadedAt.value < CACHE_TTL_MS) {
      return brands.value
    }
    if (brandsRequest) return brandsRequest

    brandsRequest = brandApi.getAll()
      .then(({ data }) => {
        brands.value = Array.isArray(data) ? data : data.data || []
        brandsLoadedAt.value = Date.now()
        return brands.value
      })
      .finally(() => {
        brandsRequest = null
      })
    return brandsRequest
  }

  async function loadCarDetail(id, force = false) {
    const key = String(id)
    const loadedAt = detailLoadedAt.value[key] || 0
    if (!force && carDetails.value[key] && Date.now() - loadedAt < CACHE_TTL_MS) {
      return carDetails.value[key]
    }
    if (detailRequests.has(key)) return detailRequests.get(key)

    const request = carApi.getById(key)
      .then(({ data }) => {
        if (!data?.success || !data?.data) {
          throw new Error(data?.message || 'Không tìm thấy xe')
        }
        const detail = data.data
        carDetails.value = { ...carDetails.value, [key]: detail }
        detailLoadedAt.value = { ...detailLoadedAt.value, [key]: Date.now() }
        return detail
      })
      .finally(() => {
        detailRequests.delete(key)
      })
    detailRequests.set(key, request)
    return request
  }

  function invalidate() {
    carsLoadedAt.value = 0
    brandsLoadedAt.value = 0
    detailLoadedAt.value = {}
  }

  return { cars, brands, loadCars, loadBrands, loadCarDetail, invalidate }
})
