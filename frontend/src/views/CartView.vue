<template>
  <div class="container cs-container py-5">
    <h2 class="cs-page-title mb-4">Giỏ hàng</h2>
    <div v-if="items.length === 0" class="cs-card p-5 text-center">
      <p class="cs-muted mb-3">Giỏ hàng trống</p>
      <router-link class="btn cs-btn cs-btn-primary" to="/car/list">Xem sản phẩm</router-link>
    </div>
    <div v-else>
      <div class="table-responsive cs-card p-3">
        <table class="table cs-table mb-0">
          <thead><tr><th>Xe</th><th>Giá</th><th>SL</th><th>Tổng</th><th></th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.name }}</td>
              <td>{{ formatPrice(item.price) }}</td>
              <td>
                <div class="d-flex align-items-center gap-2">
                  <button class="btn btn-sm cs-btn-ghost" @click="decrement(item.id)">-</button>
                  <span>{{ item.quantity }}</span>
                  <button class="btn btn-sm cs-btn-ghost" @click="increment(item.id)">+</button>
                </div>
              </td>
              <td>{{ formatPrice(item.price * item.quantity) }}</td>
              <td><button class="btn btn-sm cs-btn-danger" @click="remove(item.id)">Xóa</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-between align-items-center mt-4">
        <h4>Tổng: <span class="text-danger">{{ formatPrice(total) }} VNĐ</span></h4>
        <div class="d-flex gap-2">
          <button class="btn cs-btn cs-btn-ghost" @click="clearCart">Xóa giỏ</button>
          <router-link class="btn cs-btn cs-btn-primary" to="/checkout">Thanh toán</router-link>
        </div>
      </div>
      <div v-if="message" class="alert alert-danger mt-3">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cartApi, formatPrice } from '../api'

const items = ref([])
const total = ref(0)
const message = ref('')

onMounted(loadCart)

async function loadCart() {
  const { data } = await cartApi.get()
  items.value = data.items || []
  total.value = data.total || 0
}

async function increment(id) {
  const { data } = await cartApi.increment(id)
  if (!data.success) { message.value = data.message; return }
  await loadCart()
}

async function decrement(id) {
  await cartApi.decrement(id)
  await loadCart()
}

async function remove(id) {
  await cartApi.remove(id)
  await loadCart()
}

async function clearCart() {
  await cartApi.clear()
  await loadCart()
}
</script>
