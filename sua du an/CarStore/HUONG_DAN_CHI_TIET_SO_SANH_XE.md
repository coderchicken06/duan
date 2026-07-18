# CarStore - Chi tiết và so sánh xe

## Đã bổ sung
- Trang chi tiết theo phong cách website xe đã qua sử dụng chính hãng: thông tin nhanh, thông số, kiểm định, trang bị, đại lý, bảo hành và xe tương tự.
- Chọn tối đa 3 xe từ danh sách hoặc trang chi tiết.
- Thanh so sánh nổi và trang `/compare`.
- Bảng so sánh tự đánh dấu nền vàng ở các thông số khác nhau.
- Admin nhập được công suất, mô-men xoắn, nhiên liệu, tiêu hao, bảo hành, đại lý, kiểm định, an toàn và tiện nghi.
- API `GET /api/cars/{id}/similar`.

## Database
- Cài mới: chạy `CarStore.sql` (xóa và tạo lại database, giữ dữ liệu mẫu trong script).
- Database đang có dữ liệu: chạy `upgrade_car_detail_compare.sql` (chỉ thêm cột, không xóa dữ liệu).

## Chạy
1. Backend: `mvn clean package -DskipTests` rồi `java -jar target/carstore-0.0.1-SNAPSHOT.jar`.
2. Frontend: xóa `node_modules`, chạy `npm install`, sau đó `npm run dev`.
