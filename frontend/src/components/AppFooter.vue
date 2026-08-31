<template>
  <footer class="ford-footer">
    <div class="ford-footer-inner">
      <div class="ford-footer-grid">
        <section class="footer-brand">
          <router-link to="/" class="footer-logo">CarStore</router-link>
          <p>Đại lý xe hiện đại với nhiều mẫu xe mới, dịch vụ bảo hành và trải nghiệm đặt cọc trực tuyến.</p>
        </section>
        <nav aria-label="Khám phá">
          <h4>Khám phá</h4>
          <router-link to="/cars">Sản phẩm</router-link>
          <router-link to="/news">Tin tức</router-link>
          <router-link v-if="!auth.isAdmin" to="/cart/view">Đặt cọc xe</router-link>
        </nav>
        <nav aria-label="Dịch vụ khách hàng">
          <h4>Dịch vụ khách hàng</h4>
          <router-link v-if="!auth.isAdmin" to="/service">Đặt lịch dịch vụ</router-link>
          <router-link v-if="!auth.isAdmin" to="/support">Đặt lịch hỗ trợ</router-link>
          <router-link v-if="auth.isUser" to="/my-orders">Đơn của tôi</router-link>
          <router-link v-if="auth.isUser" to="/quotation-history">Báo giá</router-link>
        </nav>
        <section>
          <h4>Liên hệ</h4>
          <a href="tel:19009999">Hotline: 1900 9999</a>
          <a href="mailto:support@carstore.vn">support@carstore.vn</a>
        </section>
      </div>
      <div class="ford-footer-bottom">© {{ year }} CarStore. Đã đăng ký bản quyền.</div>
    </div>
  </footer>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const year = new Date().getFullYear()
const auth = useAuthStore()
</script>

<style scoped>
.ford-footer {
  margin-top: auto;
  padding: 3rem 1.5rem 1.25rem;
  background: #111827;
  color: #d1d5db;
}

.ford-footer-inner {
  width: min(1160px, 100%);
  margin: 0 auto;
}

.ford-footer-grid {
  display: grid;
  grid-template-columns: minmax(240px, 1.7fr) repeat(3, minmax(140px, 1fr));
  gap: 2.5rem;
}

.footer-logo {
  display: inline-block;
  margin-bottom: 0.8rem;
  color: #fff;
  font-size: 1.35rem;
  font-weight: 800;
  text-decoration: none;
}

.footer-brand p {
  max-width: 390px;
  margin: 0;
  line-height: 1.7;
}

.ford-footer h4 {
  margin: 0 0 0.9rem;
  color: #fff;
  font-size: 0.98rem;
}

.ford-footer nav,
.ford-footer section:not(.footer-brand) {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
}

.ford-footer a {
  color: #d1d5db;
  line-height: 1.45;
  text-decoration: none;
}

.ford-footer a:hover,
.ford-footer a:focus-visible {
  color: #fff;
}

.ford-footer a:focus-visible {
  outline: 2px solid #ef4444;
  outline-offset: 3px;
}

.ford-footer-bottom {
  margin-top: 2.25rem;
  padding-top: 1.15rem;
  border-top: 1px solid rgb(255 255 255 / 12%);
  color: #9ca3af;
  font-size: 0.88rem;
  text-align: center;
}

@media (max-width: 820px) {
  .ford-footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 520px) {
  .ford-footer {
    padding-inline: 1rem;
  }

  .ford-footer-grid {
    grid-template-columns: 1fr;
    gap: 1.65rem;
  }
}
</style>
