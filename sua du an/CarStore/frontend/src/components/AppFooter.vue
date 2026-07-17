<template>
  <footer class="ford-footer">
    <div class="ford-footer-grid">
      <div>
        <h3>CarStore</h3>
        <p>Đại lý xe hiện đại với nhiều mẫu xe mới, dịch vụ bảo hành và trải nghiệm đặt cọc trực tuyến.</p>
      </div>
      <div>
        <h4>Liên hệ</h4>
        <p>Hotline: 1900 9999</p>
        <p>Email: support@carstore.vn</p>
      </div>
      <div>
        <h4>Dịch vụ</h4>
        <p>Test drive</p>
        <p>Bảo hành & sửa chữa</p>
        <p>Mua xe trả góp</p>
      </div>
    </div>
    <div class="ford-footer-bottom">© {{ year }} CarStore. All rights reserved.</div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>
