<template>
  <main class="cart-page">
    <header class="ford-hero-panel compact content-only cart-heading">
      <div class="ford-hero-panel-content">
        <span class="cart-eyebrow">GIỎ HÀNG CỦA BẠN</span>
        <h1 class="cs-page-title">Xe đang quan tâm</h1>
        <p>Kiểm tra số lượng và thông tin xe trước khi gửi yêu cầu đặt xe.</p>
      </div>
    </header>

    <div class="container cs-container cart-content">
    <div v-if="loading" class="cs-card cart-state">Đang tải giỏ hàng...</div>

    <div v-else-if="loadError" class="alert alert-danger" role="alert">
      {{ loadError }}
      <button class="btn btn-sm cs-btn-ghost ms-2" type="button" @click="loadCart">Thử lại</button>
    </div>

    <section v-else-if="items.length === 0" class="cs-card cart-empty">
      <div class="cart-empty-icon">🚗</div>
      <h2>Giỏ hàng đang trống</h2>
      <p class="cs-muted">Hãy chọn mẫu xe phù hợp để tiếp tục gửi yêu cầu đặt xe.</p>
      <router-link class="btn cs-btn cs-btn-primary" to="/car/list">Xem danh sách xe</router-link>
    </section>

    <div v-else class="cart-layout">
      <section class="cart-items" aria-label="Sản phẩm trong giỏ">
        <article v-for="item in items" :key="item.id" class="cs-card cart-item">
          <img class="cart-image" :src="carImageUrl(item.image)" :alt="item.name" />

          <div class="cart-info">
            <div class="cart-title-row">
              <div>
                <h2>{{ item.name }}</h2>
                <p v-if="item.year || item.bodyType || item.color" class="cart-meta">
                  <span v-if="item.year">Năm {{ item.year }}</span>
                  <span v-if="item.bodyType">{{ item.bodyType }}</span>
                  <span v-if="item.color">Màu {{ item.color }}</span>
                </p>
              </div>
              <button
                class="cart-remove"
                type="button"
                :disabled="busyId === item.id"
                :aria-label="`Xóa ${item.name}`"
                @click="remove(item.id)"
              >
                Xóa
              </button>
            </div>

            <div class="cart-price-row">
              <div>
                <span class="cart-label">Đơn giá</span>
                <strong>{{ formatPrice(item.price) }} VNĐ</strong>
              </div>

              <div class="cart-quantity">
                <span class="cart-label">Số lượng</span>
                <div class="quantity-control">
                  <button type="button" :disabled="busyId === item.id" @click="decrement(item.id)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button
                    type="button"
                    :disabled="busyId === item.id || (item.stock != null && item.quantity >= item.stock)"
                    @click="increment(item.id)"
                  >
                    +
                  </button>
                </div>
              </div>

              <div class="cart-line-total">
                <span class="cart-label">Thành tiền</span>
                <strong>{{ formatPrice(item.price * item.quantity) }} VNĐ</strong>
              </div>
            </div>
          </div>
        </article>
      </section>

      <aside class="cs-card cart-summary">
        <h2>Tóm tắt giỏ hàng</h2>
        <div class="summary-row"><span>Số lượng</span><strong>{{ totalQuantity }} xe</strong></div>
        <div class="summary-total"><span>Tổng tiền</span><strong>{{ formatPrice(total) }} VNĐ</strong></div>
        <router-link class="btn cs-btn cs-btn-primary w-100" to="/checkout">Gửi yêu cầu đặt xe</router-link>
        <button class="btn cs-btn cs-btn-ghost w-100" type="button" :disabled="clearing" @click="clearCart">
          {{ clearing ? 'Đang xóa...' : 'Xóa toàn bộ giỏ' }}
        </button>
        <router-link class="cart-continue" to="/car/list">← Tiếp tục xem xe</router-link>
      </aside>
    </div>

    <div v-if="message" class="alert alert-danger mt-3" role="alert">{{ message }}</div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { carImageUrl, cartApi, formatPrice } from '../api'

const items = ref([])
const total = ref(0)
const loading = ref(true)
const clearing = ref(false)
const busyId = ref(null)
const message = ref('')
const loadError = ref('')

const totalQuantity = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

onMounted(loadCart)

async function loadCart() {
  loading.value = true
  loadError.value = ''
  try {
    const { data } = await cartApi.get()
    items.value = data.items || []
    total.value = Number(data.total || 0)
  } catch {
    loadError.value = 'Không thể tải giỏ hàng. Vui lòng kiểm tra kết nối máy chủ.'
  } finally {
    loading.value = false
  }
}

async function updateQuantity(id, action) {
  busyId.value = id
  message.value = ''
  try {
    const response = await action()
    if (response.data?.success === false) {
      message.value = response.data.message || 'Không thể cập nhật số lượng'
      return
    }
    await loadCart()
  } catch {
    message.value = 'Không thể cập nhật giỏ hàng. Vui lòng thử lại.'
  } finally {
    busyId.value = null
  }
}

function increment(id) {
  return updateQuantity(id, () => cartApi.increment(id))
}

function decrement(id) {
  return updateQuantity(id, () => cartApi.decrement(id))
}

function remove(id) {
  return updateQuantity(id, () => cartApi.remove(id))
}

async function clearCart() {
  clearing.value = true
  message.value = ''
  try {
    await cartApi.clear()
    await loadCart()
  } catch {
    message.value = 'Không thể xóa giỏ hàng. Vui lòng thử lại.'
  } finally {
    clearing.value = false
  }
}
</script>

<style scoped>
.cart-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:28px}.cart-eyebrow{display:block;color:#b91c1c;font-size:.78rem;font-weight:800;letter-spacing:.14em;margin-bottom:8px}.cart-count{background:#fef2f2;border:1px solid #fecaca;border-radius:999px;color:#991b1b;font-weight:700;padding:8px 14px}.cart-state,.cart-empty{padding:56px 24px;text-align:center}.cart-empty-icon{font-size:3rem;margin-bottom:14px}.cart-empty h2{font-size:1.4rem;font-weight:800}.cart-layout{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:24px;align-items:start}.cart-items{display:grid;gap:16px}.cart-item{display:grid;grid-template-columns:190px minmax(0,1fr);overflow:hidden}.cart-image{width:100%;height:100%;min-height:190px;object-fit:cover;background:#eef1f5}.cart-info{padding:22px}.cart-title-row,.cart-price-row{display:flex;justify-content:space-between;gap:18px}.cart-title-row h2{font-size:1.25rem;font-weight:800;margin:0}.cart-meta{display:flex;gap:8px;margin:8px 0 0}.cart-meta span{background:#f3f4f6;border-radius:999px;color:#4b5563;font-size:.82rem;padding:4px 9px}.cart-remove{background:none;border:0;color:#b91c1c;font-weight:700;height:max-content}.cart-remove:disabled{opacity:.5}.cart-price-row{align-items:flex-end;border-top:1px solid #eee;margin-top:24px;padding-top:18px}.cart-price-row>div{display:grid;gap:5px}.cart-label{color:#6b7280;font-size:.78rem}.cart-line-total{text-align:right}.cart-line-total strong{color:#b91c1c}.quantity-control{display:flex;align-items:center;border:1px solid #d1d5db;border-radius:10px;overflow:hidden}.quantity-control button{background:#f9fafb;border:0;height:34px;width:36px;font-size:1.15rem}.quantity-control button:disabled{color:#c5c9d0}.quantity-control span{min-width:38px;text-align:center;font-weight:800}.cart-summary{padding:24px;position:sticky;top:92px}.cart-summary h2{font-size:1.2rem;font-weight:800;margin-bottom:22px}.summary-row,.summary-total{display:flex;justify-content:space-between;gap:16px}.summary-row{border-bottom:1px solid #eee;padding-bottom:16px}.summary-total{align-items:flex-end;padding:20px 0}.summary-total strong{color:#b91c1c;font-size:1.2rem}.cart-summary .btn{margin-bottom:10px}.cart-continue{display:block;color:#4b5563;text-align:center;margin-top:8px;text-decoration:none}@media(max-width:900px){.cart-layout{grid-template-columns:1fr}.cart-summary{position:static}}@media(max-width:640px){.cart-heading{align-items:flex-start;flex-direction:column}.cart-item{grid-template-columns:1fr}.cart-image{height:210px}.cart-price-row{align-items:flex-start;flex-wrap:wrap}.cart-line-total{text-align:left}}
.cart-page{background:#f7f8fa;min-height:70vh;padding-bottom:48px}.cart-heading{display:grid;margin-bottom:0}.cart-heading h1{color:#fff}.cart-heading p{margin-bottom:0}.cart-content{padding-top:28px}.cart-eyebrow{color:#f87171}
</style>
