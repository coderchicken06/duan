# CarStore Frontend

Giao diện chính của CarStore sử dụng Vue 3, Vite và TypeScript.

## Luồng chạy

1. `main.ts` khởi tạo Vue, Pinia và Vue Router.
2. `router/index.ts` ánh xạ URL tới từng `View`.
3. View gọi hàm trong `api/index.ts`.
4. Axios instance tại `api/client.ts` gửi request kèm session cookie.
5. Spring Boot xử lý và trả JSON.
6. View cập nhật trạng thái phản hồi lên giao diện.

## Lệnh sử dụng

```bash
npm install
npm run dev
npm run type-check
npm run build
```

Vite chạy tại cổng `5173` và chuyển tiếp `/api`, `/images`, `/login`,
`/logout`, `/oauth2` sang Spring Boot tại cổng `8082`.

## Cấu trúc cần nhớ

- `src/views`: màn hình theo route.
- `src/components`: thành phần dùng chung.
- `src/api`: khai báo request Axios.
- `src/router`: route và kiểm tra quyền.
- `src/stores`: trạng thái đăng nhập.
- `src/composables`: logic dùng lại không phụ thuộc giao diện.
- `src/assets`: CSS dùng chung.

Không đặt dữ liệu xe mẫu trong Vue. Dữ liệu sản phẩm, hãng xe, ảnh, đơn hàng
và yêu cầu hỗ trợ đều phải lấy từ REST API và SQL Server.
