USE master;
GO

-- LOCAL RESET/SEED SCRIPT: xóa và tạo lại toàn bộ database CarStore.
-- Không chạy trên production hoặc database cần giữ dữ liệu.

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
    status NVARCHAR(20) NOT NULL CONSTRAINT DF_Car_Status DEFAULT 'AVAILABLE',

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
    CONSTRAINT CK_Car_Status CHECK (status IN ('AVAILABLE', 'DEPOSITED', 'SOLD', 'INACTIVE')),
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
CREATE UNIQUE INDEX UX_CarImage_OnePrimaryPerCar
ON dbo.CarImage(car_id)
WHERE is_primary = 1;
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
    enabled BIT NOT NULL CONSTRAINT DF_Account_Enabled DEFAULT 0,
    verification_code NVARCHAR(10) NULL,
    verification_expired DATETIME NULL,
    CONSTRAINT PK_Account PRIMARY KEY (username),
    CONSTRAINT CK_Account_Role CHECK (role IN ('ROLE_ADMIN', 'ROLE_USER'))
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
    status NVARCHAR(50) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT 'PENDING',
    deposit_status NVARCHAR(20) NOT NULL CONSTRAINT DF_Orders_DepositStatus DEFAULT 'UNPAID',
    deposit_amount FLOAT NULL,
    deposit_method NVARCHAR(50) NULL,
    deposit_paid_at DATETIME NULL,
    CONSTRAINT PK_Orders PRIMARY KEY (id),
    CONSTRAINT FK_Orders_Account FOREIGN KEY (username) REFERENCES dbo.Account(username),
    CONSTRAINT CK_Orders_Status CHECK (status IN ('PENDING', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED')),
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
    name NVARCHAR(255) NOT NULL,
    phone NVARCHAR(50) NOT NULL,
    username NVARCHAR(50) NOT NULL,
    type NVARCHAR(255) NOT NULL,
    content NVARCHAR(1000) NOT NULL,
    status NVARCHAR(255) NOT NULL CONSTRAINT DF_Support_Status DEFAULT N'Chờ xử lý',
    car_info NVARCHAR(255) NULL,
    service_type NVARCHAR(255) NULL,
    appointment_date DATE NULL,
    appointment_time TIME NULL,
    CONSTRAINT PK_SupportRequest PRIMARY KEY (id),
    CONSTRAINT FK_SupportRequest_Account FOREIGN KEY (username) REFERENCES dbo.Account(username),
    CONSTRAINT CK_SupportRequest_Type CHECK (type IN ('chat', 'consulting', 'warranty', 'service')),
    CONSTRAINT CK_SupportRequest_Status CHECK (status IN (N'Chờ xử lý', N'Đang xử lý', N'Đã xử lý', N'Đã hủy')),
    CONSTRAINT CK_SupportRequest_ServiceFields CHECK (
        type <> 'service'
        OR (car_info IS NOT NULL AND service_type IS NOT NULL
            AND appointment_date IS NOT NULL AND appointment_time IS NOT NULL)
    )
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
    status NVARCHAR(50) NOT NULL CONSTRAINT DF_Quotation_Status DEFAULT N'Chờ xác nhận',
    quotation_no NVARCHAR(40) NULL,
    updated_at DATETIME NULL,
    order_id INT NULL,
    CONSTRAINT PK_Quotation PRIMARY KEY (id),
    CONSTRAINT FK_Quotation_Account FOREIGN KEY (customer_username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Quotation_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT FK_Quotation_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT CK_Quotation_Amounts CHECK (car_price >= 0 AND discount >= 0 AND total_price >= 0),
    CONSTRAINT CK_Quotation_Status CHECK (
        status IN (N'Chờ xác nhận', N'Đã duyệt', N'Khách đã xác nhận', N'Từ chối', N'Đã chuyển đơn')
    )
);
GO

CREATE TABLE dbo.QuotationItem (
    id INT IDENTITY(1,1) NOT NULL,
    quotation_id INT NOT NULL,
    car_id INT NOT NULL,
    quantity INT NOT NULL CONSTRAINT DF_QuotationItem_Quantity DEFAULT 1,
    unit_price FLOAT NOT NULL,
    discount FLOAT NOT NULL CONSTRAINT DF_QuotationItem_Discount DEFAULT 0,
    total FLOAT NOT NULL,
    CONSTRAINT PK_QuotationItem PRIMARY KEY (id),
    CONSTRAINT FK_QuotationItem_Quotation FOREIGN KEY (quotation_id) REFERENCES dbo.Quotation(id),
    CONSTRAINT FK_QuotationItem_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT CK_QuotationItem_Values CHECK (quantity > 0 AND unit_price >= 0 AND discount >= 0 AND total >= 0)
);
GO

-- =============================================================
-- 7. ĐÁNH GIÁ XE
-- =============================================================
CREATE TABLE dbo.Review (
    id INT IDENTITY(1,1) NOT NULL,
    username NVARCHAR(50) NOT NULL,
    car_id INT NOT NULL,
    rating INT NOT NULL,
    comment NVARCHAR(1000) NOT NULL,
    review_date DATETIME NOT NULL CONSTRAINT DF_Review_Date DEFAULT GETDATE(),
    CONSTRAINT PK_Review PRIMARY KEY (id),
    CONSTRAINT FK_Review_Account FOREIGN KEY (username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Review_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
    CONSTRAINT CK_Review_Rating CHECK (rating BETWEEN 1 AND 5)
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
    status NVARCHAR(50) NOT NULL CONSTRAINT DF_Contract_Status DEFAULT N'Chờ ký',
    deposit_status NVARCHAR(20) NOT NULL CONSTRAINT DF_Contract_DepositStatus DEFAULT 'UNPAID',
    deposit_amount FLOAT NULL,
    deposit_method NVARCHAR(50) NULL,
    deposit_paid_at DATETIME NULL,
    contract_no NVARCHAR(40) NULL,
    quotation_id INT NULL,
    pdf_path NVARCHAR(500) NULL,
    signed_at DATETIME NULL,
    CONSTRAINT PK_Contract PRIMARY KEY (id),
    CONSTRAINT UQ_Contract_Order UNIQUE (order_id),
    CONSTRAINT FK_Contract_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT FK_Contract_Quotation FOREIGN KEY (quotation_id) REFERENCES dbo.Quotation(id),
    CONSTRAINT FK_Contract_Customer FOREIGN KEY (customer_username) REFERENCES dbo.Account(username),
    CONSTRAINT FK_Contract_Employee FOREIGN KEY (employee_username) REFERENCES dbo.Account(username),
    CONSTRAINT CK_Contract_DepositStatus CHECK (deposit_status IN ('UNPAID', 'PAID')),
    CONSTRAINT CK_Contract_Status CHECK (status IN (N'Chờ ký', N'Đã ký', N'Hủy'))
);
GO

-- =============================================================
-- 10. KHUYẾN MÃI
-- =============================================================
CREATE TABLE dbo.Promotion (
    id INT IDENTITY(1,1) NOT NULL,
    title NVARCHAR(200) NOT NULL,
    type NVARCHAR(20) NOT NULL,
    value FLOAT NOT NULL,
    description NVARCHAR(MAX) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    status BIT NOT NULL CONSTRAINT DF_Promotion_Status DEFAULT 1,
    created_at DATETIME NOT NULL CONSTRAINT DF_Promotion_CreatedAt DEFAULT GETDATE(),

    CONSTRAINT PK_Promotion PRIMARY KEY (id),
    CONSTRAINT CK_Promotion_Value CHECK (
        (type = 'PERCENT' AND value > 0 AND value <= 100)
        OR (type = 'FIXED' AND value > 0)
    ),
    CONSTRAINT CK_Promotion_Date CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);
GO

CREATE TABLE dbo.PaymentTransaction (
    id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,
    gateway NVARCHAR(50) NOT NULL,
    transaction_no NVARCHAR(100) NOT NULL,
    bank_code NVARCHAR(30) NULL,
    amount FLOAT NOT NULL,
    status NVARCHAR(30) NOT NULL,
    response_code NVARCHAR(30) NULL,
    paid_at DATETIME NULL,
    raw_response NVARCHAR(MAX) NULL,
    CONSTRAINT PK_PaymentTransaction PRIMARY KEY (id),
    CONSTRAINT UQ_PaymentTransaction_No UNIQUE (transaction_no),
    CONSTRAINT FK_PaymentTransaction_Order FOREIGN KEY (order_id) REFERENCES dbo.Orders(id),
    CONSTRAINT CK_PaymentTransaction_Amount CHECK (amount >= 0)
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
    slug NVARCHAR(320) NOT NULL,
    status NVARCHAR(30) NOT NULL CONSTRAINT DF_News_Status DEFAULT 'DRAFT',
    create_date DATETIME NOT NULL CONSTRAINT DF_News_Date DEFAULT GETDATE(),
    updated_at DATETIME NULL,
    author NVARCHAR(50) NULL,
    CONSTRAINT PK_News PRIMARY KEY (id),
    CONSTRAINT FK_News_Author FOREIGN KEY (author) REFERENCES dbo.Account(username),
    CONSTRAINT CK_News_Status CHECK (status IN ('DRAFT', 'PUBLISHED'))
);
GO

-- =============================================================
-- 12. CHỈ MỤC HỖ TRỢ TRUY VẤN (Đã loại bỏ IX_Car_BrandId bị trùng)
-- =============================================================
CREATE INDEX IX_Orders_Username ON dbo.Orders(username);
CREATE INDEX IX_Orders_Status ON dbo.Orders(status);
CREATE UNIQUE INDEX UX_Account_Email ON dbo.Account(email) WHERE email IS NOT NULL;
CREATE INDEX IX_OrderDetail_OrderId ON dbo.OrderDetail(order_id);
CREATE INDEX IX_OrderDetail_CarId ON dbo.OrderDetail(car_id);
CREATE INDEX IX_SupportRequest_Username ON dbo.support_request(username);
CREATE INDEX IX_SupportRequest_TypeStatus ON dbo.support_request(type, status);
CREATE INDEX IX_Review_CarId ON dbo.Review(car_id);
CREATE UNIQUE INDEX UX_Review_UserCar ON dbo.Review(username, car_id)
WHERE username IS NOT NULL AND car_id IS NOT NULL;
CREATE INDEX IX_Car_BrandPrice ON dbo.Car(brand_id, price);
CREATE INDEX IX_Orders_UserStatusCreated ON dbo.Orders(username, status, create_date DESC);
CREATE INDEX IX_Quotation_CustomerStatus ON dbo.Quotation(customer_username, status);
CREATE INDEX IX_PaymentTransaction_OrderNo ON dbo.PaymentTransaction(order_id, transaction_no);
CREATE INDEX IX_Promotion_StatusDates ON dbo.Promotion(status, start_date, end_date);
CREATE UNIQUE INDEX UX_News_Slug ON dbo.News(slug) WHERE slug IS NOT NULL;
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
-- 14. DỮ LIỆU MẪU XE
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

(N'BMW X5', 3500000000, 'bmwx5.png',
 N'SUV sang trọng, động cơ mạnh, nội thất cao cấp', 2, 2024, N'Trắng', 5,
 N'Tháng 03 Năm 2024', 9000, N'Xăng', N'3.0L Turbo', N'Nâu', N'SUV', 5, N'AWD', N'Tự động 8 cấp', 381, N'520 Nm', N'Xăng', N'9.2 L/100km', N'18 tháng', N'CarStore Hà Nội', N'Cầu Giấy, Hà Nội', N'Premium Certified', N'Kiểm định 120 hạng mục', N'ABS, DSC, camera 360, cảnh báo điểm mù', N'Ghế điện, HUD, âm thanh Harman Kardon'),

(N'Mercedes C300', 2500000000, 'mercedesC300.png',
 N'Sedan Đức, công nghệ mới, lái tự động', 3, 2023, N'Xám', 6,
 N'Tháng 06 Năm 2023', 15000, N'Xăng', N'2.0L Turbo', N'Đen', N'Sedan', 5, N'RWD', N'Tự động 9 cấp', 258, N'400 Nm', N'Xăng', N'7.1 L/100km', N'12 tháng', N'CarStore Đà Nẵng', N'Hải Châu, Đà Nẵng', N'CarStore Certified', N'Không tai nạn, ODO xác thực', N'ABS, ESP, hỗ trợ giữ làn, camera 360', N'MBUX, ghế nhớ vị trí, đèn viền nội thất'),

(N'Honda Civic', 900000000, 'civic.png',
 N'Xe thể thao, thiết kế năng động, tiết kiệm', 4, 2022, N'Đỏ', 10,
 N'Tháng 11 Năm 2022', 23000, N'Xăng', N'1.5L Turbo', N'Đen', N'Sedan', 5, N'FWD', N'CVT', 176, N'240 Nm', N'Xăng', N'6.3 L/100km', N'12 tháng', N'CarStore Hồ Chí Minh', N'Thủ Đức, TP.HCM', N'CarStore Certified', N'Lịch sử bảo dưỡng đầy đủ', N'Honda Sensing, ABS, VSA, camera lùi', N'Apple CarPlay, điều hòa tự động, đề nổ từ xa'),

(N'Toyota Corolla', 800000000, 'Corolla.png',
 N'Sedan nhỏ gọn, tin cậy, bảo dưỡng rẻ', 1, 2023, N'Bạc', 9,
 N'Tháng 08 Năm 2023', 12000, N'Xăng', N'1.8L', N'Đen', N'Sedan', 5, N'FWD', N'CVT', 138, N'172 Nm', N'Xăng', N'6.0 L/100km', N'12 tháng', N'CarStore Cần Thơ', N'Ninh Kiều, Cần Thơ', N'CarStore Certified', N'Xe gia đình, hồ sơ rõ ràng', N'ABS, EBD, cân bằng điện tử, camera lùi', N'Màn hình cảm ứng, điều hòa tự động, Smart Key'),

(N'BMW 3 Series', 2000000000, 'bmw3series.png',
 N'Sedan thể thao, hiệu năng cao, lái cảm giác tuyệt vời', 2, 2024, N'Xanh đen', 4,
 N'Tháng 02 Năm 2024', 7000, N'Xăng', N'2.0L Turbo', N'Đen', N'Sedan', 5, N'RWD', N'Tự động 8 cấp', 184, N'300 Nm', N'Xăng', N'6.8 L/100km', N'18 tháng', N'CarStore Hà Nội', N'Nam Từ Liêm, Hà Nội', N'Premium Certified', N'Ngoại thất nguyên bản, ODO xác thực', N'ABS, DSC, hỗ trợ đỗ xe, cảnh báo va chạm', N'iDrive, ghế thể thao, điều hòa 3 vùng');
GO

UPDATE dbo.Car
SET price = CASE name
    WHEN N'Toyota Camry' THEN 1200000000
    WHEN N'BMW X5' THEN 3500000000
    WHEN N'Mercedes C300' THEN 2500000000
    WHEN N'BMW 3 Series' THEN 2000000000
    WHEN N'Honda Civic' THEN 900000000
    WHEN N'Toyota Corolla' THEN 800000000
END
WHERE name IN (N'Toyota Camry', N'BMW X5', N'Mercedes C300', N'BMW 3 Series', N'Honda Civic', N'Toyota Corolla');
GO

-- =============================================================
-- 15. DỮ LIỆU MẪU TÀI KHOẢN
-- =============================================================
INSERT INTO dbo.Account(username, password, fullname, email, role) VALUES
('admin', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Quản trị viên', 'admin@carstore.com', 'ROLE_ADMIN'),
('user1', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Nguyễn Văn A', 'user1@carstore.com', 'ROLE_USER'),
('user2', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Trần Thị B', 'user2@carstore.com', 'ROLE_USER'),
('user3', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Lê Văn C', 'user3@carstore.com', 'ROLE_USER');

UPDATE dbo.Account SET enabled = 1;
GO

-- =============================================================
-- 16. DỮ LIỆU MẪU HỖ TRỢ / DỊCH VỤ
-- =============================================================
INSERT INTO dbo.support_request
(name, phone, username, type, content, status, car_info, service_type, appointment_date, appointment_time)
VALUES
(N'Nguyễn Văn A', N'+84909123456', N'user1', N'service',
 N'Yêu cầu đặt lịch dịch vụ', N'Chờ xử lý',
 N'51G-123.45 / Toyota Camry', N'Bảo dưỡng định kỳ', CAST(DATEADD(DAY, 7, GETDATE()) AS DATE), '09:00'),

(N'Trần Thị B', N'+84912345678', N'user2', N'chat',
 N'Tư vấn thủ tục mua xe trả góp', N'Chờ xử lý',
 NULL, NULL, NULL, NULL);
GO

-- =============================================================
-- 17. DỮ LIỆU MẪU ĐƠN HÀNG
-- =============================================================
INSERT INTO dbo.Orders
(username, address, registration_address, payment_method, status,
 deposit_status, deposit_amount, deposit_method, deposit_paid_at)
VALUES
('user1', N'TP Hồ Chí Minh', N'TP Hồ Chí Minh', N'SePay', N'DELIVERED',
 'PAID', 50000000, N'SePay', '2026-08-20T09:15:00'),

('user1', N'Bình Dương', N'Bình Dương', N'SePay', N'PROCESSING',
 'PAID', 50000000, N'SePay', '2026-08-22T14:30:00');
GO

INSERT INTO dbo.OrderDetail(order_id, car_id, price, quantity)
VALUES
(1, 1, 1200000000, 1),
(2, 2, 3500000000, 1);
GO

-- =============================================================
-- 18. DỮ LIỆU MẪU BÁO GIÁ
-- =============================================================
INSERT INTO dbo.Quotation
(customer_username, car_id, car_price, discount, total_price, note, status, quotation_no)
VALUES
('user1', 1, 1200000000, 20000000, 1180000000, N'Khách muốn trả góp', N'Đã duyệt', N'BG-001'),
('user1', 2, 3500000000, 50000000, 3450000000, N'Áp dụng chính sách ưu đãi của đại lý', N'Đã duyệt', N'BG-002');
GO

-- Đồng bộ dữ liệu mẫu cũ nếu script được chạy trên cơ sở dữ liệu đã tồn tại.
UPDATE dbo.Quotation
SET note = N'Áp dụng chính sách ưu đãi của đại lý'
WHERE note = N'Ưu đãi tháng 7';
GO

INSERT INTO dbo.QuotationItem
(quotation_id, car_id, quantity, unit_price, discount, total)
VALUES
(1, 1, 1, 1200000000, 20000000, 1180000000),
(2, 2, 1, 3500000000, 50000000, 3450000000);
GO

-- =============================================================
-- 19. DỮ LIỆU MẪU ĐÁNH GIÁ XE
-- =============================================================
INSERT INTO dbo.Review(username, car_id, rating, comment) VALUES
('user1', 1, 5, N'Xe đẹp, chạy rất êm');
GO

-- =============================================================
-- 20. DỮ LIỆU MẪU THANH TOÁN
-- =============================================================
INSERT INTO dbo.PaymentTransaction
(order_id, gateway, transaction_no, amount, status, response_code, paid_at)
VALUES
(1, N'SePay', 'VQR001', 50000000, 'SUCCESS', '00', '2026-08-20T09:15:00'),
(2, N'SePay', 'VQR002', 50000000, 'SUCCESS', '00', '2026-08-22T14:30:00');
GO

-- =============================================================
-- 21. DỮ LIỆU MẪU HỢP ĐỒNG
-- =============================================================
INSERT INTO dbo.Contract
(order_id, customer_username, employee_username, deposit, total,
 payment_method, status, deposit_status, deposit_amount, deposit_method, deposit_paid_at, contract_no)
VALUES
(1, 'user1', 'admin', 50000000, 1200000000,
 N'Chuyển khoản', N'Đã ký', 'PAID', 50000000, N'SePay', '2026-08-20T09:15:00', N'HD-001'),

(2, 'user1', 'admin', 50000000, 3500000000,
 N'Trả góp', N'Đã ký', 'PAID', 50000000, N'SePay', '2026-08-22T14:30:00', N'HD-002');
GO

-- =============================================================
-- 22. DỮ LIỆU MẪU KHUYẾN MÃI
-- =============================================================
INSERT INTO dbo.Promotion
(title, type, value, description, start_date, end_date, status)
VALUES
(N'Ưu đãi mùa thu 2026', 'PERCENT', 10, N'Giảm giá cho các xe áp dụng', '2026-08-01', '2026-12-31', 1),
(N'Ưu đãi khai trương', 'PERCENT', 15, N'Tặng bảo hiểm thân vỏ', '2026-08-01', '2026-12-31', 1);
GO

UPDATE dbo.Promotion
SET title = N'Ưu đãi mùa thu 2026', start_date = '2026-08-01', end_date = '2026-12-31'
WHERE title = N'Khuyến mãi tháng 7';

UPDATE dbo.Promotion
SET start_date = '2026-08-01', end_date = '2026-12-31'
WHERE title = N'Ưu đãi khai trương';
GO

-- =============================================================
-- 23. SEED DATA CHUẨN HÓA CHO DEMO (CHẠY LẠI AN TOÀN)
-- =============================================================

-- 23.1. Thêm 4 thương hiệu nếu chưa có
IF NOT EXISTS (SELECT 1 FROM dbo.Brand WHERE name = N'Ford')
BEGIN
    INSERT INTO dbo.Brand(name) VALUES (N'Ford');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Brand WHERE name = N'Toyota')
BEGIN
    INSERT INTO dbo.Brand(name) VALUES (N'Toyota');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Brand WHERE name = N'VinFast')
BEGIN
    INSERT INTO dbo.Brand(name) VALUES (N'VinFast');
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Brand WHERE name = N'Hyundai')
BEGIN
    INSERT INTO dbo.Brand(name) VALUES (N'Hyundai');
END;
GO

-- 23.2. Thêm 3 tài khoản mẫu (schema hiện tại chỉ cho ROLE_ADMIN / ROLE_USER)
IF NOT EXISTS (SELECT 1 FROM dbo.Account WHERE username = 'admin' OR email = 'admin@carstore.com')
BEGIN
    INSERT INTO dbo.Account(username, password, fullname, email, role, enabled)
    VALUES ('admin', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Admin CarStore', 'admin@carstore.com', 'ROLE_ADMIN', 1);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Account WHERE username = 'staff' OR email = 'staff@carstore.com')
BEGIN
    INSERT INTO dbo.Account(username, password, fullname, email, role, enabled)
    VALUES ('staff', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Staff CarStore', 'staff@carstore.com', 'ROLE_USER', 1);
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Account WHERE username = 'tu_nguyen' OR email = 'tu.nguyen@gmail.com')
BEGIN
    INSERT INTO dbo.Account(username, password, fullname, email, role, enabled)
    VALUES ('tu_nguyen', '{bcrypt}$2a$10$e3n7G1RIh4W7GRTDotAvou6TScLvhWtt5K6V6.kAg2/Be9TNftR66', N'Nguyễn Tường Tu', 'tu.nguyen@gmail.com', 'ROLE_USER', 1);
END;
GO

-- 23.3. Thêm 3 xe mẫu bổ sung (tổng cộng đúng 9 xe trong toàn bộ dữ liệu mẫu)
IF NOT EXISTS (SELECT 1 FROM dbo.Car WHERE name = N'Ford Ranger Wildtrak 2025')
BEGIN
    INSERT INTO dbo.Car (
        name, price, image, description, brand_id, [year], color, stock,
        first_registration, mileage, engine_type, engine_capacity,
        interior_color, body_type, seats, drivetrain, transmission,
        horsepower, torque, fuel_type, fuel_consumption, warranty,
        dealer_name, dealer_address, inspection_level, inspection_note,
        safety_features, comfort_features
    )
    SELECT N'Ford Ranger Wildtrak 2025', 950000000, N'Wildtrak2025.png',
           N'Pick-up mạnh mẽ, phù hợp công việc và du lịch', b.id, 2025, N'Đen', 3,
           N'Tháng 01/2025', 12000, N'Diesel', N'2.8L', N'Nâu', N'Pick-up', 5, N'4x4', N'Tự động 10 cấp', 201,
           N'500 Nm', N'Diesel', N'8.2 L/100km', N'24 tháng', N'CarStore HCM', N'Q7, TP.HCM', N'CarStore Certified',
           N'Đã kiểm định kỹ thuật', N'ABS, ESC, camera 360, cảnh báo va chạm', N'Điều hòa tự động, màn hình 12 inch, ghế sưởi'
    FROM dbo.Brand b WHERE b.name = N'Ford';
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Car WHERE name = N'VinFast VF 8 2025')
BEGIN
    INSERT INTO dbo.Car (
        name, price, image, description, brand_id, [year], color, stock,
        first_registration, mileage, engine_type, engine_capacity,
        interior_color, body_type, seats, drivetrain, transmission,
        horsepower, torque, fuel_type, fuel_consumption, warranty,
        dealer_name, dealer_address, inspection_level, inspection_note,
        safety_features, comfort_features
    )
    SELECT N'VinFast VF 8 2025', 1090000000, N'VF8.png',
           N'Xe điện SUV 7 chỗ, trạm sạc rộng, công nghệ an toàn', b.id, 2025, N'Xám', 3,
           N'Tháng 01/2025', 4200, N'Điện', N'300 kW', N'Trắng', N'SUV', 7, N'AWD', N'Tự động', 300,
           N'620 Nm', N'Điện', N'Không tiêu hao xăng', N'36 tháng', N'CarStore HN', N'Ba Đình, Hà Nội', N'Green Certified',
           N'Thử nghiệm pin 100%', N'Phanh tái sinh, camera toàn cảnh, hệ thống ADAS', N'Phanh tay điện tử, màn hình 15 inch, hàng ghế sau độc lập'
    FROM dbo.Brand b WHERE b.name = N'VinFast';
END;
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Car WHERE name = N'Hyundai Tucson 2024')
BEGIN
    INSERT INTO dbo.Car (
        name, price, image, description, brand_id, [year], color, stock,
        first_registration, mileage, engine_type, engine_capacity,
        interior_color, body_type, seats, drivetrain, transmission,
        horsepower, torque, fuel_type, fuel_consumption, warranty,
        dealer_name, dealer_address, inspection_level, inspection_note,
        safety_features, comfort_features
    )
    SELECT N'Hyundai Tucson 2024', 930000000, N'Tucson.png',
           N'SUV tiện nghi, phù hợp gia đình', b.id, 2024, N'Xanh', 4,
           N'Tháng 05/2024', 11000, N'Xăng', N'2.0L', N'Đen', N'SUV', 5, N'AWD', N'Tự động 8 cấp', 180,
           N'191 Nm', N'Xăng', N'7.4 L/100km', N'18 tháng', N'CarStore HCM', N'Bình Thạnh, TP.HCM', N'CarStore Certified',
           N'Kiểm tra kỹ thuật đầy đủ', N'ABS, EBD, cảnh báo xe phía sau', N'Điều hòa tự động 2 vùng, màn hình cảm ứng 10.25 inch'
    FROM dbo.Brand b WHERE b.name = N'Hyundai';
END;
GO

-- Đồng bộ ảnh chính và thư viện ảnh theo đúng tên file trong static/images.
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET ANSI_WARNINGS ON;
SET ARITHABORT ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET NUMERIC_ROUNDABORT OFF;

DECLARE @CarImageSeed TABLE (
    car_name NVARCHAR(100) NOT NULL,
    image_url NVARCHAR(255) NOT NULL,
    sort_order INT NOT NULL,
    is_primary BIT NOT NULL
);

INSERT INTO @CarImageSeed (car_name, image_url, sort_order, is_primary) VALUES
(N'Toyota Camry', N'camry.jpg', 0, 1),
(N'BMW X5', N'bmwx5.png', 0, 1),
(N'Mercedes C300', N'mercedesC300.png', 0, 1),
(N'Honda Civic', N'civic.png', 0, 1),
(N'Toyota Corolla', N'Corolla.png', 0, 1),
(N'BMW 3 Series', N'bmw3series.png', 0, 1),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025.png', 0, 1),
(N'VinFast VF 8 2025', N'VF8.png', 0, 1),
(N'Hyundai Tucson 2024', N'Tucson.png', 0, 1),

(N'Toyota Camry', N'camry-gallery1.jpg', 1, 0),
(N'Toyota Camry', N'camry-gallery2.png', 2, 0),
(N'Toyota Camry', N'camry-gallery3.png', 3, 0),
(N'Toyota Camry', N'camry-gallery4.png', 4, 0),
(N'Toyota Camry', N'camry-gallery5.png', 5, 0),
(N'BMW X5', N'bmwx5-gallery1.png', 1, 0),
(N'BMW X5', N'bmwx5-gallery2.png', 2, 0),
(N'BMW X5', N'bmwx5-gallery3.png', 3, 0),
(N'BMW X5', N'bmwx5-gallery4.png', 4, 0),
(N'BMW X5', N'bmwx5-gallery5.png', 5, 0),
(N'Mercedes C300', N'mercedesC300-gallery1.png', 1, 0),
(N'Mercedes C300', N'mercedesC300-gallery2.png', 2, 0),
(N'Mercedes C300', N'mercedesC300-gallery3.png', 3, 0),
(N'Mercedes C300', N'mercedesC300-gallery4.png', 4, 0),
(N'Mercedes C300', N'mercedesC300-gallery5.png', 5, 0),
(N'Honda Civic', N'civic-gallery1.png', 1, 0),
(N'Honda Civic', N'civic-gallery2.png', 2, 0),
(N'Honda Civic', N'civic-gallery3.png', 3, 0),
(N'Honda Civic', N'civic-gallery4.png', 4, 0),
(N'Honda Civic', N'civic-gallery5.png', 5, 0),
(N'Toyota Corolla', N'Corolla-gallery1.png', 1, 0),
(N'Toyota Corolla', N'Corolla-gallery2.png', 2, 0),
(N'Toyota Corolla', N'Corolla-gallery3.png', 3, 0),
(N'Toyota Corolla', N'Corolla-gallery4.png', 4, 0),
(N'BMW 3 Series', N'bmw3series-gallery1.png', 1, 0),
(N'BMW 3 Series', N'bmw3series-gallery2.png', 2, 0),
(N'BMW 3 Series', N'bmw3series-gallery3.png', 3, 0),
(N'BMW 3 Series', N'bmw3series-gallery4.png', 4, 0),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025-gallery1.png', 1, 0),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025-gallery2.png', 2, 0),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025-gallery3.png', 3, 0),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025-gallery4.png', 4, 0),
(N'Ford Ranger Wildtrak 2025', N'Wildtrak2025-gallery5.png', 5, 0),
(N'VinFast VF 8 2025', N'VF8-gallery1.png', 1, 0),
(N'VinFast VF 8 2025', N'VF8-gallery2.png', 2, 0),
(N'VinFast VF 8 2025', N'VF8-gallery3.png', 3, 0),
(N'VinFast VF 8 2025', N'VF8-gallery4.png', 4, 0),
(N'VinFast VF 8 2025', N'VF8-gallery5.png', 5, 0),
(N'Hyundai Tucson 2024', N'Tucson-gallery1.png', 1, 0),
(N'Hyundai Tucson 2024', N'Tucson-gallery2.png', 2, 0),
(N'Hyundai Tucson 2024', N'Tucson-gallery3.png', 3, 0),
(N'Hyundai Tucson 2024', N'Tucson-gallery4.png', 4, 0),
(N'Hyundai Tucson 2024', N'Tucson-gallery5.png', 5, 0);

UPDATE car
SET image = seed.image_url
FROM dbo.Car car
JOIN @CarImageSeed seed ON seed.car_name = car.name AND seed.is_primary = 1;

DELETE car_image
FROM dbo.CarImage car_image
JOIN dbo.Car car ON car.id = car_image.car_id
JOIN @CarImageSeed seed ON seed.car_name = car.name;

INSERT INTO dbo.CarImage (car_id, image_url, sort_order, is_primary)
SELECT car.id, seed.image_url, seed.sort_order, seed.is_primary
FROM @CarImageSeed seed
JOIN dbo.Car car ON car.name = seed.car_name;
GO

-- 23.4. Tạo hai đơn hàng mẫu cho khách hàng tu_nguyen
IF NOT EXISTS (
    SELECT 1 FROM dbo.Orders
    WHERE username = 'tu_nguyen'
      AND address = N'123 Lê Lợi, Quận 1, TP.HCM'
)
BEGIN
    INSERT INTO dbo.Orders(username, address, registration_address, payment_method, status, deposit_status, deposit_amount, deposit_method, deposit_paid_at)
    VALUES ('tu_nguyen', N'123 Lê Lợi, Quận 1, TP.HCM', N'123 Lê Lợi, Quận 1, TP.HCM', N'SePay', 'PROCESSING', 'PAID', 50000000, N'SePay', '2026-08-24T10:05:00');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Orders
    WHERE username = 'tu_nguyen'
      AND address = N'456 Nguyễn Huệ, Quận 1, TP.HCM'
)
BEGIN
    INSERT INTO dbo.Orders(username, address, registration_address, payment_method, status, deposit_status, deposit_amount, deposit_method, deposit_paid_at)
    VALUES ('tu_nguyen', N'456 Nguyễn Huệ, Quận 1, TP.HCM', N'456 Nguyễn Huệ, Quận 1, TP.HCM', N'SePay', 'CANCELLED', 'UNPAID', 50000000, N'SePay', NULL);
END;
GO

-- 23.5. Thêm chi tiết đơn hàng mẫu
IF NOT EXISTS (
    SELECT 1
    FROM dbo.OrderDetail od
    JOIN dbo.Orders o ON o.id = od.order_id
    WHERE o.username = 'tu_nguyen'
      AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM'
      AND od.car_id = (SELECT TOP 1 id FROM dbo.Car WHERE name = N'Ford Ranger Wildtrak 2025')
)
BEGIN
    INSERT INTO dbo.OrderDetail(order_id, car_id, price, quantity)
    SELECT o.id, c.id, c.price, 1
    FROM dbo.Orders o
    JOIN dbo.Car c ON c.name = N'Ford Ranger Wildtrak 2025'
    WHERE o.username = 'tu_nguyen'
      AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM';
END;
GO

IF NOT EXISTS (
    SELECT 1
    FROM dbo.OrderDetail od
    JOIN dbo.Orders o ON o.id = od.order_id
    WHERE o.username = 'tu_nguyen'
      AND o.address = N'456 Nguyễn Huệ, Quận 1, TP.HCM'
      AND od.car_id = (SELECT TOP 1 id FROM dbo.Car WHERE name = N'Honda Civic')
)
BEGIN
    INSERT INTO dbo.OrderDetail(order_id, car_id, price, quantity)
    SELECT o.id, c.id, c.price, 1
    FROM dbo.Orders o
    JOIN dbo.Car c ON c.name = N'Honda Civic'
    WHERE o.username = 'tu_nguyen'
      AND o.address = N'456 Nguyễn Huệ, Quận 1, TP.HCM';

    UPDATE dbo.Car
    SET stock = stock - 1
    WHERE name = N'Honda Civic' AND stock > 0;
END;
GO

-- 23.6. Thêm 1 giao dịch SePay mẫu với trạng thái SUCCESS
IF NOT EXISTS (SELECT 1 FROM dbo.PaymentTransaction WHERE transaction_no = 'SEPAY_DEMO_001')
BEGIN
    INSERT INTO dbo.PaymentTransaction(order_id, gateway, transaction_no, bank_code, amount, status, response_code, paid_at)
    SELECT o.id, N'SePay', 'SEPAY_DEMO_001', N'VietinBank', 50000000, 'SUCCESS', '00', '2026-08-24T10:05:00'
    FROM dbo.Orders o
    WHERE o.username = 'tu_nguyen'
      AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM'
      AND o.status = 'PROCESSING'
      AND o.deposit_status = 'PAID';
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Contract c
    JOIN dbo.Orders o ON o.id = c.order_id
    WHERE o.username = 'tu_nguyen' AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM'
)
BEGIN
    INSERT INTO dbo.Contract
        (order_id, customer_username, total, deposit, payment_method, status,
         deposit_status, deposit_amount, deposit_method, deposit_paid_at, contract_no)
    SELECT o.id, o.username, 950000000, 50000000, N'SePay', N'Chờ ký',
           'PAID', 50000000, N'SePay', o.deposit_paid_at, N'HD-003'
    FROM dbo.Orders o
    WHERE o.username = 'tu_nguyen' AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM';
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Contract c
    JOIN dbo.Orders o ON o.id = c.order_id
    WHERE o.username = 'tu_nguyen' AND o.address = N'456 Nguyễn Huệ, Quận 1, TP.HCM'
)
BEGIN
    INSERT INTO dbo.Contract
        (order_id, customer_username, total, deposit, payment_method, status,
         deposit_status, deposit_amount, deposit_method, contract_no)
    SELECT o.id, o.username, 900000000, 50000000, N'SePay', N'Hủy',
           'UNPAID', 50000000, N'SePay', N'HD-004'
    FROM dbo.Orders o
    WHERE o.username = 'tu_nguyen' AND o.address = N'456 Nguyễn Huệ, Quận 1, TP.HCM';
END;
GO
GO

-- 23.7. Chuẩn hóa lại thời điểm thanh toán của dữ liệu demo đã tồn tại.
UPDATE o
SET status = 'DELIVERED', deposit_status = 'PAID', deposit_paid_at = '2026-08-20T09:15:00'
FROM dbo.Orders o
JOIN dbo.OrderDetail od ON od.order_id = o.id
JOIN dbo.Car c ON c.id = od.car_id
WHERE o.username = 'user1' AND c.name = N'Toyota Camry';

UPDATE o
SET status = 'PROCESSING', deposit_status = 'PAID', deposit_paid_at = '2026-08-22T14:30:00'
FROM dbo.Orders o
JOIN dbo.OrderDetail od ON od.order_id = o.id
JOIN dbo.Car c ON c.id = od.car_id
WHERE o.username = 'user1' AND c.name = N'BMW X5';

UPDATE o
SET status = 'PROCESSING', deposit_status = 'PAID', deposit_paid_at = '2026-08-24T10:05:00'
FROM dbo.Orders o
JOIN dbo.OrderDetail od ON od.order_id = o.id
JOIN dbo.Car c ON c.id = od.car_id
WHERE o.username = 'tu_nguyen'
  AND o.address = N'123 Lê Lợi, Quận 1, TP.HCM'
  AND c.name = N'Ford Ranger Wildtrak 2025';

UPDATE o
SET status = 'CANCELLED', deposit_status = 'UNPAID', deposit_paid_at = NULL
FROM dbo.Orders o
JOIN dbo.OrderDetail od ON od.order_id = o.id
JOIN dbo.Car c ON c.id = od.car_id
WHERE o.username = 'tu_nguyen'
  AND o.address = N'456 Nguyễn Huệ, Quận 1, TP.HCM'
  AND c.name = N'Honda Civic';
GO

INSERT INTO dbo.PromotionCar(promotion_id, car_id) VALUES
(1, 1),
(2, 3);
GO

-- =============================================================
-- 23. DỮ LIỆU MẪU TIN TỨC
-- =============================================================
INSERT INTO dbo.News(title, slug, image, summary, content, status, author)
VALUES
(N'Ford Ranger 2026 ra mắt', 'ford-ranger-2026-ra-mat', '/images/FordRanger2026.png',
 N'Ford Ranger phiên bản mới',
 N'Phiên bản mới có nhiều công nghệ hỗ trợ lái hiện đại...', 'PUBLISHED', 'admin'),

(N'BMW giảm giá mùa hè', 'bmw-giam-gia-mua-he', '/images/bmwx5-gallery1.png',
 N'Ưu đãi lên đến 200 triệu',
 N'Chương trình áp dụng đến hết tháng 8...', 'PUBLISHED', 'admin');
GO

UPDATE dbo.News
SET image = CASE slug
    WHEN 'ford-ranger-2026-ra-mat' THEN '/images/FordRanger2026.png'
    WHEN 'bmw-giam-gia-mua-he' THEN '/images/bmwx5-gallery1.png'
END
WHERE slug IN ('ford-ranger-2026-ra-mat', 'bmw-giam-gia-mua-he');
GO

-- =============================================================
-- 24. KIỂM TRA TOÀN BỘ DATABASE & HOÀN TẤT
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
UNION ALL SELECT N'PaymentTransaction', COUNT(*) FROM dbo.PaymentTransaction
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
SELECT * FROM dbo.PaymentTransaction;
SELECT * FROM dbo.Contract;
SELECT * FROM dbo.Promotion;
SELECT * FROM dbo.PromotionCar;
SELECT * FROM dbo.News;
GO

PRINT N'Setup hoàn thành!';
GO

IF SUSER_ID(N'carstore_app') IS NOT NULL
BEGIN
    IF DATABASE_PRINCIPAL_ID(N'carstore_app') IS NULL
        CREATE USER [carstore_app] FOR LOGIN [carstore_app];

    IF IS_ROLEMEMBER(N'db_datareader', N'carstore_app') <> 1
        ALTER ROLE [db_datareader] ADD MEMBER [carstore_app];

    IF IS_ROLEMEMBER(N'db_datawriter', N'carstore_app') <> 1
        ALTER ROLE [db_datawriter] ADD MEMBER [carstore_app];
END;
GO
