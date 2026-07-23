# CarStore – sơ đồ giải thích khi bảo vệ

## 1. Kiến trúc

CarStore dùng một giao diện Vue 3 + TypeScript. Vue gọi REST API Spring Boot
và nhận JSON. Backend Spring Boot được viết bằng Java, xử lý nghiệp vụ qua
Service, Repository, Entity rồi đọc/ghi SQL Server.

`SpaController` chỉ chuyển URL của Vue Router về `index.html` khi refresh
trang production; controller này không render Thymeleaf và không chứa nghiệp vụ.

## 2. Luồng sản phẩm

```text
CarListView
→ GET /api/cars
→ RestCarController
→ CarRepository
→ dbo.Car
→ JSON
→ CarCard
```

Chi tiết xe tải thông tin, thư viện ảnh và xe tương tự:

```text
GET /api/cars/{id}
GET /api/cars/{id}/images
GET /api/cars/{id}/similar
```

## 3. Luồng giỏ hàng và đặt xe

Giỏ hàng được lưu trong HTTP session:

```text
CarCard
→ POST /api/cart/add/{carId}
→ RestCartController
→ CartService
→ kiểm tra xe tồn tại và còn hàng
→ cập nhật session cart
```

Checkout:

```text
CheckoutView
→ POST /api/orders/checkout
→ RestOrderController
→ OrderService (@Transactional)
→ kiểm tra tồn kho
→ tạo Orders và OrderDetail
→ trừ tồn kho
→ xóa giỏ trong session
```

## 4. Luồng đăng nhập

```text
LoginView
→ POST /api/auth/login
→ Spring Security AuthenticationManager
→ AccountUserDetailsService
→ AccountRepository
→ tạo SecurityContext trong session
```

Google OAuth2 dùng `CustomOAuth2UserService`. Mật khẩu database, Gmail và
Google OAuth được đọc từ `.env`, không đặt trong source.

## 5. Luồng dịch vụ và hỗ trợ

Hai biểu mẫu đều lưu về `SupportRequest`; trường `type` phân biệt:

- `SERVICE`: lịch dịch vụ.
- `CONSULTATION`, `WARRANTY`, `GENERAL`: yêu cầu hỗ trợ.

`SupportRequestService` chịu trách nhiệm validate số điện thoại, thời gian
hẹn và quyền sở hữu yêu cầu.

## 6. Luồng quản trị

Route Vue có `meta.admin`; backend tiếp tục kiểm tra `ROLE_ADMIN` bằng Spring
Security. Không dựa riêng vào việc ẩn nút trên giao diện.

Dashboard dùng một request:

```text
GET /api/admin/dashboard-info
→ đếm Car, Account, Orders, Brand
→ tính doanh thu và xe bán chạy
→ trả một response tổng hợp
```

## 7. Database chính

File chuẩn duy nhất để tạo SQL Server là `CarStore.sql`.

Các bảng nghiệp vụ cốt lõi:

- `Brand` 1–n `Car`.
- `Car` 1–n `CarImage`.
- `Account` 1–n `Orders`.
- `Orders` 1–n `OrderDetail`.
- `Car` 1–n `OrderDetail`.
- `Account` 1–n `support_request`.

## 8. Quy tắc quan trọng để phản biện

- Frontend validation giúp trải nghiệm tốt; backend validation mới là lớp bảo vệ thật.
- Không tin ID, giá, tồn kho hoặc role do frontend gửi lên.
- Nghiệp vụ nhiều bước phải chạy trong transaction.
- Không xóa xe đã xuất hiện trong lịch sử đơn hàng.
- Một xe chỉ có một ảnh chính; `Car.image` đồng bộ với ảnh chính trong `CarImage`.
- So sánh cần 2 xe khác nhau, tối đa 3 xe.
- Đặt lịch không nhận thời điểm trong quá khứ.
- Đặt cọc chỉ thực hiện một lần cho mỗi đơn.
