/*
===============================================================================
 CARSTORE.SQL - DATABASE DUY NHẤT CỦA DỰ ÁN
===============================================================================
- Tạo mới database CarStore.
- Có đầy đủ bảng, khóa ngoại, dữ liệu mẫu, cột stock và bảng CarImage.
- Đồng bộ với entity Car.java và CarImage.java.
- Không cần chạy thêm bất kỳ file SQL nào khác.

CẢNH BÁO: Script xóa database CarStore cũ rồi tạo lại từ đầu.
===============================================================================
*/

USE master;
GO

IF DB_ID(N'CarStore') IS NOT NULL
BEGIN
    ALTER DATABASE CarStore SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CarStore;
END;
GO

CREATE DATABASE CarStore;
GO

USE CarStore;
GO

-- =============================================================
-- 1. DANH MỤC HÃNG XE
-- =============================================================
CREATE TABLE dbo.Brand (
    id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(50) NOT NULL,
    CONSTRAINT PK_Brand PRIMARY KEY (id),
    CONSTRAINT UQ_Brand_Name UNIQUE (name)
);
GO

-- =============================================================
-- 2. XE - ĐÃ BỔ SUNG THÔNG TIN CHI TIẾT
-- =============================================================
CREATE TABLE dbo.Car (
    id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    image NVARCHAR(255) NULL,
    description NVARCHAR(MAX) NULL,
    brand_id INT NOT NULL,
    [year] INT NULL,
    color NVARCHAR(50) NULL,
    stock INT NOT NULL CONSTRAINT DF_Car_Stock DEFAULT 0,

    first_registration NVARCHAR(50) NULL,
    mileage INT NULL,
    engine_type NVARCHAR(100) NULL,
    engine_capacity NVARCHAR(50) NULL,
    interior_color NVARCHAR(50) NULL,
    body_type NVARCHAR(50) NULL,
    seats INT NULL,
    drivetrain NVARCHAR(50) NULL,
    transmission NVARCHAR(50) NULL,
    horsepower INT NULL,
    torque NVARCHAR(50) NULL,
    fuel_type NVARCHAR(50) NULL,
    fuel_consumption NVARCHAR(50) NULL,
    warranty NVARCHAR(150) NULL,
    dealer_name NVARCHAR(150) NULL,
    dealer_address NVARCHAR(255) NULL,
    inspection_level NVARCHAR(100) NULL,
    inspection_note NVARCHAR(500) NULL,
    safety_features NVARCHAR(1000) NULL,
    comfort_features NVARCHAR(1000) NULL,

    CONSTRAINT PK_Car PRIMARY KEY (id),
    CONSTRAINT FK_Car_Brand FOREIGN KEY (brand_id) REFERENCES dbo.Brand(id),
    CONSTRAINT CK_Car_Price CHECK (price >= 0),
    CONSTRAINT CK_Car_Stock CHECK (stock >= 0),
    CONSTRAINT CK_Car_Mileage CHECK (mileage IS NULL OR mileage >= 0),
    CONSTRAINT CK_Car_Seats CHECK (seats IS NULL OR seats > 0)
);
GO


-- =============================================================
-- 2A. THƯ VIỆN ẢNH XE (1 XE - NHIỀU ẢNH)
-- =============================================================
CREATE TABLE dbo.CarImage (
    id INT IDENTITY(1,1) NOT NULL,
    car_id INT NOT NULL,
    image_url NVARCHAR(500) NOT NULL,
    sort_order INT NOT NULL CONSTRAINT DF_CarImage_SortOrder DEFAULT 0,
    is_primary BIT NOT NULL CONSTRAINT DF_CarImage_IsPrimary DEFAULT 0,
    CONSTRAINT PK_CarImage PRIMARY KEY (id),
    CONSTRAINT FK_CarImage_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id) ON DELETE CASCADE,
    CONSTRAINT UQ_CarImage UNIQUE (car_id, image_url),
    CONSTRAINT CK_CarImage_SortOrder CHECK (sort_order >= 0)
);
GO
CREATE INDEX IX_CarImage_CarId ON dbo.CarImage(car_id, is_primary DESC, sort_order ASC);
GO

-- =============================================================
-- 3. TÀI KHOẢN
-- =============================================================
CREATE TABLE dbo.Account (
    username NVARCHAR(50) NOT NULL,
    password NVARCHAR(100) NOT NULL,
    fullname NVARCHAR(100) NULL,
    email NVARCHAR(100) NULL,
    role NVARCHAR(20) NOT NULL,
    CONSTRAINT PK_Account PRIMARY KEY (username),
    CONSTRAINT CK_Account_Role CHECK (role IN ('ROLE_ADMIN', 'ROLE_USER', 'ROLE_EMPLOYEE'))
);
GO

-- =============================================================
-- 4. ĐƠN HÀNG
-- =============================================================
CREATE TABLE dbo.Orders (
    id INT IDENTITY(1,1) NOT NULL,
    username NVARCHAR(50) NOT NULL,
    create_date DATETIME NOT NULL CONSTRAINT DF_Orders_CreateDate DEFAULT GETDATE(),
    address NVARCHAR(255) NULL,
    registration_address NVARCHAR(255) NULL,
    payment_method NVARCHAR(50) NULL,
    status NVARCHAR(50) NULL CONSTRAINT DF_Orders_Status DEFAULT 'PENDING',
    deposit_status NVARCHAR(20) NOT NULL CONSTRAINT DF_Orders_DepositStatus DEFAULT 'UNPAID',
    deposit_amount FLOAT NULL,
    deposit_method NVARCHAR(50) NULL,
    deposit_paid_at DATETIME NULL,
    CONSTRAINT PK_Orders PRIMARY KEY (id),
    CONSTRAINT FK_Orders_Account FOREIGN KEY (username) REFERENCES dbo.Account(username),
    CONSTRAINT CK_Orders_DepositAmount CHECK (deposit_amount IS NULL OR deposit_amount >= 0),
    CONSTRAINT CK_Orders_DepositStatus CHECK (deposit_status IN ('UNPAID', 'PAID'))
);
GO

CREATE TABLE dbo.OrderDetail (
    id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,
    car_id INT NOT NULL,
    price FLOAT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT PK_OrderDetail PRIMARY KEY (id),
    CONSTRAINT FK_OrderDetail_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT FK_OrderDetail_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT CK_OrderDetail_Price CHECK (price >= 0),
    CONSTRAINT CK_OrderDetail_Quantity CHECK (quantity > 0)
);
GO

-- =============================================================
-- 5. HỖ TRỢ / ĐẶT LỊCH DỊCH VỤ
-- =============================================================
CREATE TABLE dbo.support_request (
    id INT IDENTITY(1,1) NOT NULL,
    name NVARCHAR(255) NULL,
    phone NVARCHAR(50) NULL,
    username NVARCHAR(100) NULL,
    type NVARCHAR(255) NULL,
    content NVARCHAR(1000) NULL,
    status NVARCHAR(255) NULL CONSTRAINT DF_Support_Status DEFAULT N'Chờ xử lý',
    car_info NVARCHAR(255) NULL,
    service_type NVARCHAR(255) NULL,
    appointment_date DATE NULL,
    appointment_time TIME NULL,
    CONSTRAINT PK_SupportRequest PRIMARY KEY (id)
);
GO

-- =============================================================
-- 6. BÁO GIÁ
-- =============================================================
CREATE TABLE dbo.Quotation (
    id INT IDENTITY(1,1) NOT NULL,
    customer_username NVARCHAR(50) NOT NULL,
    car_id INT NOT NULL,
    quotation_date DATETIME NOT NULL CONSTRAINT DF_Quotation_Date DEFAULT GETDATE(),
    car_price FLOAT NOT NULL,
    discount FLOAT NOT NULL CONSTRAINT DF_Quotation_Discount DEFAULT 0,
    total_price FLOAT NOT NULL,
    note NVARCHAR(500) NULL,
    status NVARCHAR(50) NULL CONSTRAINT DF_Quotation_Status DEFAULT N'Chờ xác nhận',
    CONSTRAINT PK_Quotation PRIMARY KEY (id),
    CONSTRAINT FK_Quotation_Account FOREIGN KEY (customer_username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Quotation_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT CK_Quotation_Amounts CHECK (car_price >= 0 AND discount >= 0 AND total_price >= 0)
);
GO

-- =============================================================
-- 7. ĐÁNH GIÁ XE
-- =============================================================
CREATE TABLE dbo.Review (
    id INT IDENTITY(1,1) NOT NULL,
    username NVARCHAR(50) NULL,
    car_id INT NULL,
    rating INT NULL,
    comment NVARCHAR(1000) NULL,
    review_date DATETIME NOT NULL CONSTRAINT DF_Review_Date DEFAULT GETDATE(),
    CONSTRAINT PK_Review PRIMARY KEY (id),
    CONSTRAINT FK_Review_Account FOREIGN KEY (username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Review_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT CK_Review_Rating CHECK (rating BETWEEN 1 AND 5)
);
GO

-- =============================================================
-- 8. THANH TOÁN
-- =============================================================
CREATE TABLE dbo.Payment (
    id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,
    amount FLOAT NOT NULL,
    payment_method NVARCHAR(50) NULL,
    transaction_code NVARCHAR(100) NULL,
    payment_date DATETIME NOT NULL CONSTRAINT DF_Payment_Date DEFAULT GETDATE(),
    status NVARCHAR(50) NULL,
    CONSTRAINT PK_Payment PRIMARY KEY (id),
    CONSTRAINT FK_Payment_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT CK_Payment_Amount CHECK (amount >= 0)
);
GO

-- =============================================================
-- 9. HỢP ĐỒNG
-- =============================================================
CREATE TABLE dbo.Contract (
    id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,
    customer_username NVARCHAR(50) NOT NULL,
    employee_username NVARCHAR(50) NULL,
    contract_date DATETIME NOT NULL CONSTRAINT DF_Contract_Date DEFAULT GETDATE(),
    deposit FLOAT NULL,
    total FLOAT NULL,
    payment_method NVARCHAR(50) NULL,
    status NVARCHAR(50) NULL,
    deposit_status NVARCHAR(20) NOT NULL CONSTRAINT DF_Contract_DepositStatus DEFAULT 'UNPAID',
    deposit_amount FLOAT NULL,
    deposit_method NVARCHAR(50) NULL,
    deposit_paid_at DATETIME NULL,
    CONSTRAINT PK_Contract PRIMARY KEY (id),
    CONSTRAINT UQ_Contract_Order UNIQUE (order_id),
    CONSTRAINT FK_Contract_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT FK_Contract_Customer FOREIGN KEY (customer_username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Contract_Employee FOREIGN KEY (employee_username) REFERENCES dbo.Account(username),
    CONSTRAINT CK_Contract_DepositStatus CHECK (deposit_status IN ('UNPAID', 'PAID'))
);
GO

-- =============================================================
-- 10. KHUYẾN MÃI
-- =============================================================
CREATE TABLE dbo.Promotion (
    id INT IDENTITY(1,1) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NULL,
    discount_percent INT NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    status BIT NOT NULL CONSTRAINT DF_Promotion_Status DEFAULT 1,
    CONSTRAINT PK_Promotion PRIMARY KEY (id),
    CONSTRAINT CK_Promotion_Discount CHECK (discount_percent BETWEEN 0 AND 100),
    CONSTRAINT CK_Promotion_Date CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
GO

CREATE TABLE dbo.PromotionCar (
    promotion_id INT NOT NULL,
    car_id INT NOT NULL,
    CONSTRAINT PK_PromotionCar PRIMARY KEY (promotion_id, car_id),
    CONSTRAINT FK_PromotionCar_Promotion FOREIGN KEY (promotion_id) REFERENCES dbo.Promotion(id),
    CONSTRAINT FK_PromotionCar_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id)
);
GO

-- =============================================================
-- 11. TIN TỨC
-- =============================================================
CREATE TABLE dbo.News (
    id INT IDENTITY(1,1) NOT NULL,
    title NVARCHAR(300) NOT NULL,
    image NVARCHAR(255) NULL,
    summary NVARCHAR(500) NULL,
    content NVARCHAR(MAX) NULL,
    create_date DATETIME NOT NULL CONSTRAINT DF_News_Date DEFAULT GETDATE(),
    author NVARCHAR(50) NULL,
    CONSTRAINT PK_News PRIMARY KEY (id),
    CONSTRAINT FK_News_Author FOREIGN KEY (author) REFERENCES dbo.Account(username)
);
GO

-- =============================================================
-- 12. CHỈ MỤC HỖ TRỢ TRUY VẤN
-- =============================================================
CREATE INDEX IX_Car_BrandId ON dbo.Car(brand_id);
CREATE INDEX IX_Orders_Username ON dbo.Orders(username);
CREATE INDEX IX_Orders_Status ON dbo.Orders(status);
CREATE INDEX IX_OrderDetail_OrderId ON dbo.OrderDetail(order_id);
CREATE INDEX IX_OrderDetail_CarId ON dbo.OrderDetail(car_id);
CREATE INDEX IX_SupportRequest_Username ON dbo.support_request(username);
CREATE INDEX IX_SupportRequest_TypeStatus ON dbo.support_request(type, status);
CREATE INDEX IX_Review_CarId ON dbo.Review(car_id);
CREATE INDEX IX_Payment_OrderId ON dbo.Payment(order_id);
CREATE UNIQUE INDEX UX_Payment_TransactionCode
ON dbo.Payment(transaction_code)
WHERE transaction_code IS NOT NULL;
GO

-- =============================================================
-- 13. DỮ LIỆU MẪU HÃNG XE
-- =============================================================
INSERT INTO dbo.Brand(name) VALUES
(N'Toyota'),
(N'BMW'),
(N'Mercedes'),
(N'Honda');
GO

-- =============================================================
-- 14. DỮ LIỆU MẪU XE - GIỮ 6 XE CŨ, BỔ SUNG THÔNG TIN CHI TIẾT
-- =============================================================
INSERT INTO dbo.Car
(name, price, image, description, brand_id, [year], color, stock,
 first_registration, mileage, engine_type, engine_capacity,
 interior_color, body_type, seats, drivetrain, transmission,
 horsepower, torque, fuel_type, fuel_consumption, warranty, dealer_name, dealer_address,
 inspection_level, inspection_note, safety_features, comfort_features)
VALUES
(N'Toyota Camry', 1200000000, 'camry.jpg',
 N'Sedan cao cấp, an toàn, tiết kiệm xăng', 1, 2023, N'Đen', 8,
 N'Tháng 01 Năm 2023', 18000, N'Xăng', N'2.5L', N'Đen', N'Sedan', 5, N'FWD', N'Tự động', 178, N'231 Nm', N'Xăng', N'6.4 L/100km', N'12 tháng hoặc 20.000 km', N'CarStore Hồ Chí Minh', N'Quận 7, TP.HCM', N'CarStore Certified', N'Đã kiểm tra kỹ thuật và hồ sơ', N'ABS, cân bằng điện tử, camera lùi, 7 túi khí', N'Điều hòa tự động, màn hình trung tâm, Apple CarPlay'),

(N'BMW X5', 3500000000, 'x5.jpg',
 N'SUV sang trọng, động cơ mạnh, nội thất cao cấp', 2, 2024, N'Trắng', 5,
 N'Tháng 03 Năm 2024', 9000, N'Xăng', N'3.0L Turbo', N'Nâu', N'SUV', 5, N'AWD', N'Tự động 8 cấp', 381, N'520 Nm', N'Xăng', N'9.2 L/100km', N'18 tháng', N'CarStore Hà Nội', N'Cầu Giấy, Hà Nội', N'Premium Certified', N'Kiểm định 120 hạng mục', N'ABS, DSC, camera 360, cảnh báo điểm mù', N'Ghế điện, HUD, âm thanh Harman Kardon'),

(N'Mercedes C300', 2500000000, 'c300.jpg',
 N'Sedan Đức, công nghệ mới, lái tự động', 3, 2023, N'Xám', 6,
 N'Tháng 06 Năm 2023', 15000, N'Xăng', N'2.0L Turbo', N'Đen', N'Sedan', 5, N'RWD', N'Tự động 9 cấp', 258, N'400 Nm', N'Xăng', N'7.1 L/100km', N'12 tháng', N'CarStore Đà Nẵng', N'Hải Châu, Đà Nẵng', N'CarStore Certified', N'Không tai nạn, ODO xác thực', N'ABS, ESP, hỗ trợ giữ làn, camera 360', N'MBUX, ghế nhớ vị trí, đèn viền nội thất'),

(N'Honda Civic', 900000000, 'civic.jpg',
 N'Xe thể thao, thiết kế năng động, tiết kiệm', 4, 2022, N'Đỏ', 10,
 N'Tháng 11 Năm 2022', 23000, N'Xăng', N'1.5L Turbo', N'Đen', N'Sedan', 5, N'FWD', N'CVT', 176, N'240 Nm', N'Xăng', N'6.3 L/100km', N'12 tháng', N'CarStore Hồ Chí Minh', N'Thủ Đức, TP.HCM', N'CarStore Certified', N'Lịch sử bảo dưỡng đầy đủ', N'Honda Sensing, ABS, VSA, camera lùi', N'Apple CarPlay, điều hòa tự động, đề nổ từ xa'),

(N'Toyota Corolla', 800000000, 'corolla.jpg',
 N'Sedan nhỏ gọn, tin cậy, bảo dưỡng rẻ', 1, 2023, N'Bạc', 9,
 N'Tháng 08 Năm 2023', 12000, N'Xăng', N'1.8L', N'Đen', N'Sedan', 5, N'FWD', N'CVT', 138, N'172 Nm', N'Xăng', N'6.0 L/100km', N'12 tháng', N'CarStore Cần Thơ', N'Ninh Kiều, Cần Thơ', N'CarStore Certified', N'Xe gia đình, hồ sơ rõ ràng', N'ABS, EBD, cân bằng điện tử, camera lùi', N'Màn hình cảm ứng, điều hòa tự động, Smart Key'),

(N'BMW 3 Series', 2000000000, 'bmw3.jpg',
 N'Sedan thể thao, hiệu năng cao, lái cảm giác tuyệt vời', 2, 2024, N'Xanh đen', 4,
 N'Tháng 02 Năm 2024', 7000, N'Xăng', N'2.0L Turbo', N'Đen', N'Sedan', 5, N'RWD', N'Tự động 8 cấp', 184, N'300 Nm', N'Xăng', N'6.8 L/100km', N'18 tháng', N'CarStore Hà Nội', N'Nam Từ Liêm, Hà Nội', N'Premium Certified', N'Ngoại thất nguyên bản, ODO xác thực', N'ABS, DSC, hỗ trợ đỗ xe, cảnh báo va chạm', N'iDrive, ghế thể thao, điều hòa 3 vùng');
GO
-- Tạo ảnh chính ban đầu từ cột Car.image; admin có thể bổ sung thêm nhiều ảnh sau.
INSERT INTO dbo.CarImage(car_id, image_url, sort_order, is_primary)
SELECT id, image, 0, 1 FROM dbo.Car WHERE image IS NOT NULL AND LTRIM(RTRIM(image)) <> '';
GO

-- Bổ sung ảnh ngang cho thư viện chi tiết xe.
-- Các file gallery là bản riêng trong static/images nên không vi phạm khóa UNIQUE(car_id, image_url).
INSERT INTO dbo.CarImage(car_id, image_url, sort_order, is_primary)
SELECT id,
       LEFT(image, LEN(image) - 4) + '-gallery1.jpg',
       1, 0
FROM dbo.Car
WHERE image LIKE '%.jpg';

INSERT INTO dbo.CarImage(car_id, image_url, sort_order, is_primary)
SELECT id,
       LEFT(image, LEN(image) - 4) + '-gallery2.jpg',
       2, 0
FROM dbo.Car
WHERE image LIKE '%.jpg';

INSERT INTO dbo.CarImage(car_id, image_url, sort_order, is_primary)
SELECT id,
       LEFT(image, LEN(image) - 4) + '-gallery3.jpg',
       3, 0
FROM dbo.Car
WHERE image LIKE '%.jpg';
GO


-- =============================================================
-- 15. DỮ LIỆU MẪU TÀI KHOẢN
-- =============================================================
INSERT INTO dbo.Account(username, password, fullname, email, role) VALUES
('admin', '{noop}123', N'Quản trị viên', 'admin@carstore.com', 'ROLE_ADMIN'),
('user1', '{noop}123', N'Nguyễn Văn A', 'user1@carstore.com', 'ROLE_USER'),
('user2', '{noop}123', N'Trần Thị B', 'user2@carstore.com', 'ROLE_USER'),
('user3', '{noop}123', N'Lê Văn C', 'user3@carstore.com', 'ROLE_USER');
GO

-- =============================================================
-- 16. DỮ LIỆU MẪU HỖ TRỢ / DỊCH VỤ
-- =============================================================
INSERT INTO dbo.support_request
(name, phone, username, type, content, status, car_info, service_type, appointment_date, appointment_time)
VALUES
(N'Nguyễn Văn A', N'0909123456', N'user1', N'service',
 N'Yêu cầu đặt lịch dịch vụ', N'Chờ xử lý',
 N'51G-123.45 / Ford Ranger', N'Bảo dưỡng định kỳ', '2026-06-25', '09:00'),

(N'Trần Thị B', N'0912345678', N'user2', N'chat',
 N'Tư vấn thủ tục mua xe trả góp', N'Chờ xử lý',
 NULL, NULL, NULL, NULL);
GO

-- =============================================================
-- 17. DỮ LIỆU MẪU ĐƠN HÀNG - PHẢI TẠO TRƯỚC PAYMENT/CONTRACT
-- =============================================================
INSERT INTO dbo.Orders
(username, address, registration_address, payment_method, status,
 deposit_status, deposit_amount, deposit_method, deposit_paid_at)
VALUES
('user1', N'TP Hồ Chí Minh', N'TP Hồ Chí Minh', N'Chuyển khoản', N'CONFIRMED',
 'PAID', 50000000, N'VNPay', GETDATE()),

('user1', N'Bình Dương', N'Bình Dương', N'Trả góp', N'PROCESSING',
 'PAID', 100000000, N'MoMo', GETDATE());
GO

INSERT INTO dbo.OrderDetail(order_id, car_id, price, quantity) VALUES
(1, 1, 830000000, 1),
(2, 2, 1200000000, 1);
GO

-- =============================================================
-- 18. DỮ LIỆU MẪU BÁO GIÁ
-- =============================================================
INSERT INTO dbo.Quotation
(customer_username, car_id, car_price, discount, total_price, note, status)
VALUES
('user1', 1, 850000000, 20000000, 830000000, N'Khách muốn trả góp', N'Chờ xác nhận'),
('user1', 2, 1250000000, 50000000, 1200000000, N'Ưu đãi tháng 7', N'Đã xác nhận');
GO

-- =============================================================
-- 19. DỮ LIỆU MẪU ĐÁNH GIÁ XE
-- =============================================================
INSERT INTO dbo.Review(username, car_id, rating, comment) VALUES
('user1', 1, 5, N'Xe đẹp, chạy rất êm'),
('user1', 2, 4, N'Nội thất đẹp, giá hơi cao'),
('admin', 3, 5, N'Đáng mua');
GO

-- =============================================================
-- 20. DỮ LIỆU MẪU THANH TOÁN
-- =============================================================
INSERT INTO dbo.Payment
(order_id, amount, payment_method, transaction_code, status)
VALUES
(1, 50000000, N'VNPay', 'VNP001', N'Thành công'),
(2, 100000000, N'MoMo', 'MOMO002', N'Thành công');
GO

-- =============================================================
-- 21. DỮ LIỆU MẪU HỢP ĐỒNG
-- =============================================================
INSERT INTO dbo.Contract
(order_id, customer_username, employee_username, deposit, total,
 payment_method, status, deposit_status, deposit_amount, deposit_method, deposit_paid_at)
VALUES
(1, 'user1', 'admin', 50000000, 830000000,
 N'Chuyển khoản', N'Đã ký', 'PAID', 50000000, N'VNPay', GETDATE()),

(2, 'user1', 'admin', 100000000, 1200000000,
 N'Trả góp', N'Chờ thanh toán', 'PAID', 100000000, N'MoMo', GETDATE());
GO

-- =============================================================
-- 22. DỮ LIỆU MẪU KHUYẾN MÃI
-- =============================================================
INSERT INTO dbo.Promotion
(title, description, discount_percent, start_date, end_date, status)
VALUES
(N'Khuyến mãi tháng 7', N'Giảm giá toàn bộ xe Ford', 10, '2026-07-01', '2026-07-31', 1),
(N'Ưu đãi khai trương', N'Tặng bảo hiểm thân vỏ', 15, '2026-08-01', '2026-08-31', 1);
GO

INSERT INTO dbo.PromotionCar(promotion_id, car_id) VALUES
(1, 1),
(1, 2),
(2, 3);
GO

-- =============================================================
-- 23. DỮ LIỆU MẪU TIN TỨC
-- =============================================================
INSERT INTO dbo.News(title, image, summary, content, author)
VALUES
(N'Ford Ranger 2026 ra mắt', 'ranger2026.jpg',
 N'Ford Ranger phiên bản mới',
 N'Phiên bản mới có nhiều công nghệ hỗ trợ lái hiện đại...', 'admin'),

(N'BMW giảm giá mùa hè', 'bmw-sale.jpg',
 N'Ưu đãi lên đến 200 triệu',
 N'Chương trình áp dụng đến hết tháng 8...', 'admin');
GO

-- =============================================================
-- 24. KIỂM TRA TOÀN BỘ DATABASE
-- =============================================================
PRINT N'=============================================================';
PRINT N'CARSTORE ĐÃ ĐƯỢC TẠO VÀ GỘP THÀNH CÔNG';
PRINT N'=============================================================';

SELECT N'Brand' AS TableName, COUNT(*) AS TotalRows FROM dbo.Brand
UNION ALL SELECT N'Car', COUNT(*) FROM dbo.Car
UNION ALL SELECT N'CarImage', COUNT(*) FROM dbo.CarImage
UNION ALL SELECT N'Account', COUNT(*) FROM dbo.Account
UNION ALL SELECT N'Orders', COUNT(*) FROM dbo.Orders
UNION ALL SELECT N'OrderDetail', COUNT(*) FROM dbo.OrderDetail
UNION ALL SELECT N'support_request', COUNT(*) FROM dbo.support_request
UNION ALL SELECT N'Quotation', COUNT(*) FROM dbo.Quotation
UNION ALL SELECT N'Review', COUNT(*) FROM dbo.Review
UNION ALL SELECT N'Payment', COUNT(*) FROM dbo.Payment
UNION ALL SELECT N'Contract', COUNT(*) FROM dbo.Contract
UNION ALL SELECT N'Promotion', COUNT(*) FROM dbo.Promotion
UNION ALL SELECT N'PromotionCar', COUNT(*) FROM dbo.PromotionCar
UNION ALL SELECT N'News', COUNT(*) FROM dbo.News;
GO

SELECT * FROM dbo.Brand;
SELECT * FROM dbo.Car;
SELECT * FROM dbo.CarImage ORDER BY car_id, is_primary DESC, sort_order, id;
SELECT * FROM dbo.Account;
SELECT * FROM dbo.Orders;
SELECT * FROM dbo.OrderDetail;
SELECT * FROM dbo.support_request;
SELECT * FROM dbo.Quotation;
SELECT * FROM dbo.Review;
SELECT * FROM dbo.Payment;
SELECT * FROM dbo.Contract;
SELECT * FROM dbo.Promotion;
SELECT * FROM dbo.PromotionCar;
SELECT * FROM dbo.News;
GO

PRINT N'Setup hoàn thành!';
GO


-- =====================================================================
-- XÁC NHẬN CÁC PHẦN NÂNG CẤP ĐÃ ĐƯỢC GỘP
-- =====================================================================
SELECT
    COL_LENGTH('dbo.Car', 'first_registration') AS first_registration,
    COL_LENGTH('dbo.Car', 'mileage') AS mileage,
    COL_LENGTH('dbo.Car', 'horsepower') AS horsepower,
    COL_LENGTH('dbo.Car', 'fuel_type') AS fuel_type,
    COL_LENGTH('dbo.Car', 'dealer_name') AS dealer_name,
    COL_LENGTH('dbo.Orders', 'deposit_status') AS deposit_status,
    COL_LENGTH('dbo.Orders', 'deposit_amount') AS deposit_amount,
    COL_LENGTH('dbo.Orders', 'deposit_method') AS deposit_method,
    COL_LENGTH('dbo.Orders', 'deposit_paid_at') AS deposit_paid_at;
GO

-- =====================================================================
-- KIỂM TRA API CHI TIẾT XE /api/cars/1 VÀ THƯ VIỆN ẢNH
-- Nếu hai truy vấn dưới đây chạy được thì schema phù hợp với Spring Boot.
-- =====================================================================
SELECT TOP (1)
    id, name, price, image, description, brand_id, [year], color, stock,
    first_registration, mileage, engine_type, engine_capacity, interior_color,
    body_type, seats, drivetrain, transmission, horsepower, torque, fuel_type,
    fuel_consumption, warranty, dealer_name, dealer_address, inspection_level,
    inspection_note, safety_features, comfort_features
FROM dbo.Car
WHERE id = 1;

SELECT id, car_id, image_url, sort_order, is_primary
FROM dbo.CarImage
WHERE car_id = 1
ORDER BY is_primary DESC, sort_order ASC, id ASC;
GO
