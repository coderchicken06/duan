# Chạy thử SePay Sandbox

## 1. Tạo lại Secret Key

1. Đăng nhập trang quản trị SePay.
2. Bật **Test Mode**.
3. Mở phần **Cổng thanh toán** → **Thông tin đơn vị**.
4. Thu hồi Secret Key đã từng bị lộ và tạo Secret Key Sandbox mới.
5. Không gửi khóa qua ảnh, không ghi khóa vào source và không commit file `.env`.

## 2. Lấy Merchant ID

Trong **Thông tin đơn vị**, sao chép giá trị **Mã đơn vị / Merchant ID** của môi trường Test.

## 3. Tạo cấu hình `.env`

Tại thư mục gốc dự án, sao chép `.env.example` thành `.env` nếu chưa có và điền:

```properties
SEPAY_MERCHANT_ID=<merchant-id-sandbox>
SEPAY_SECRET_KEY=<secret-key-sandbox-moi>
SEPAY_API_KEY=<api-key-sandbox-moi>
SEPAY_CHECKOUT_URL=https://pay-sandbox.sepay.vn/v1/checkout/init
```

Không thêm `.env` vào Git.

## 4. Chạy backend

Đảm bảo SQL Server và database CarStore đang hoạt động, sau đó chạy tại thư mục gốc:

```powershell
mvn spring-boot:run
```

Backend mặc định chạy tại:

```text
http://localhost:8082
```

## 5. Chạy frontend

Mở terminal khác:

```powershell
cd frontend
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, mặc định là `http://localhost:5173`.

## 6. Chạy ngrok

Mở terminal khác:

```powershell
ngrok http 8082
```

Sao chép HTTPS forwarding domain mà ngrok cung cấp.

Webhook URL:

```text
https://<ngrok-domain>/api/payment/sepay/webhook
```

Không hardcode domain ngrok vào source vì domain có thể thay đổi sau mỗi lần chạy.

## 7. Cấu hình IPN trên SePay

1. Trong SePay Test Mode, mở phần cấu hình **IPN/Webhook**.
2. Nhập webhook URL ngrok ở trên.
3. Chọn phương thức xác thực bằng API Key.
4. Chọn API Key tương ứng với `SEPAY_API_KEY` trong file `.env`.
5. Lưu cấu hình và dùng chức năng gửi thử webhook nếu SePay cung cấp.

Backend cũng chấp nhận dạng header:

```text
Authorization: Apikey <secret-key>
```

## 8. Kiểm thử end-to-end

1. Đăng nhập tài khoản khách hàng.
2. Thêm xe vào giỏ hàng.
3. Mở Checkout và nhập địa chỉ nhận xe.
4. Chọn **Thanh toán QR SePay**.
5. Xác nhận Checkout.
6. Hệ thống tạo Order và chuyển sang PaymentView.
7. PaymentView gọi `POST /api/payment/create-qr`.
8. Trình duyệt submit form đã ký sang SePay Sandbox.
9. Quét QR hoặc dùng chức năng mô phỏng thanh toán của Sandbox.
10. SePay gọi `POST /api/payment/sepay/webhook` qua ngrok.
11. Kiểm tra database:
    - `PaymentTransaction.status = SUCCESS`.
    - `Orders.deposit_status = PAID`.
    - `Orders.deposit_method = SePay`.
    - `Contract.deposit_status = PAID`.
    - `Contract.status` không thay đổi.
12. Kiểm tra khách hàng và Admin nhận được email.
13. Gửi lại cùng transaction ID để xác nhận không có PaymentTransaction hoặc email trùng.
14. Kiểm tra tồn kho không bị webhook trừ thêm.

## 9. Phương thức thanh toán

CarStore chỉ hỗ trợ **Thanh toán QR SePay**. Checkout luôn tạo Order với `paymentMethod = SePay` và chuyển sang trang thanh toán cọc.
