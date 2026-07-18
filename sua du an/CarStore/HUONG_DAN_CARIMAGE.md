# Nâng cấp nhiều ảnh cho mỗi xe

## Database hiện tại đã có dữ liệu
Chạy file `upgrade_car_image_gallery.sql` trong SQL Server Management Studio.
Script chỉ tạo bảng `CarImage` nếu chưa có và giữ nguyên toàn bộ dữ liệu cũ.

## Database tạo mới từ đầu
Chạy `CarStore_HoanChinh_CarImage.sql`.
File này tạo lại database CarStore và đã có bảng `CarImage`.

## API
- `GET /api/cars/{carId}/images`
- `POST /api/cars/{carId}/images`
- `PUT /api/cars/{carId}/images/{imageId}`
- `DELETE /api/cars/{carId}/images/{imageId}`

## Admin
Vào trang thêm/sửa xe. Khu vực **Thư viện ảnh của xe** cho phép chọn nhiều ảnh, sắp xếp và xóa ảnh.

## Chạy frontend
```powershell
cd frontend
npm install
npm run dev
```
