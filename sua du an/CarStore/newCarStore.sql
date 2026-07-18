-- ===============================================
-- CARSTORE DATABASE - FULL SETUP
-- Chạy trên SQL Server
-- ===============================================

-- ===== 1. TẠO DATABASE =====
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'CarStore')
BEGIN
    ALTER DATABASE CarStore SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE CarStore;
END
GO

CREATE DATABASE CarStore1;
GO

USE CarStore1;
GO

-- ===== 2. TẠO CÁC BẢNG BỀN =====

CREATE TABLE Brand (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Car (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    image NVARCHAR(255),
    description NVARCHAR(MAX),
    brand_id INT NOT NULL,
    year INT,
    color NVARCHAR(50),
    stock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (brand_id) REFERENCES Brand(id)
);

CREATE TABLE Account (
    username NVARCHAR(50) PRIMARY KEY,
    password NVARCHAR(100) NOT NULL,
    fullname NVARCHAR(100),
    email NVARCHAR(100),
    role NVARCHAR(20) NOT NULL
);

CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL,
    create_date DATETIME DEFAULT GETDATE(),
    address NVARCHAR(255),
    registration_address NVARCHAR(255),
    payment_method NVARCHAR(50),
    status NVARCHAR(50),
    FOREIGN KEY (username) REFERENCES Account(username)
);

CREATE TABLE OrderDetail (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    car_id INT NOT NULL,
    price FLOAT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (car_id) REFERENCES Car(id)
);

-- ===== BẢNG SUPPORT / SERVICE =====
-- Dùng cho chức năng Hỗ trợ, Đặt lịch dịch vụ, Lịch sử yêu cầu
CREATE TABLE support_request (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255),
    phone NVARCHAR(50),
    username NVARCHAR(100),
    type NVARCHAR(255),
    content NVARCHAR(1000),
    status NVARCHAR(255) DEFAULT N'Chờ xử lý',
    car_info NVARCHAR(255),
    service_type NVARCHAR(255),
    appointment_date DATE NULL,
    appointment_time TIME NULL
);
-- báo giá 
CREATE TABLE Quotation (
    id INT IDENTITY(1,1) PRIMARY KEY,
    customer_username NVARCHAR(50) NOT NULL,
    car_id INT NOT NULL,
    quotation_date DATETIME DEFAULT GETDATE(),
    car_price FLOAT NOT NULL,
    discount FLOAT DEFAULT 0,
    total_price FLOAT NOT NULL,
    note NVARCHAR(500),
    status NVARCHAR(50) DEFAULT N'Chờ xác nhận',

    FOREIGN KEY (customer_username) REFERENCES Account(username),
    FOREIGN KEY (car_id) REFERENCES Car(id)
);
-- đánh giá xe
CREATE TABLE Review (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50),
    car_id INT,
    rating INT CHECK(rating BETWEEN 1 AND 5),
    comment NVARCHAR(1000),
    review_date DATETIME DEFAULT GETDATE(),

    FOREIGN KEY(username) REFERENCES Account(username),
    FOREIGN KEY(car_id) REFERENCES Car(id)
);
-- thanh toán trực tuyến
CREATE TABLE Payment (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    amount FLOAT,
    payment_method NVARCHAR(50),
    transaction_code NVARCHAR(100),
    payment_date DATETIME DEFAULT GETDATE(),
    status NVARCHAR(50),

    FOREIGN KEY(order_id) REFERENCES Orders(id)
);
-- quản lí hợp đồng 
CREATE TABLE Contract (
    id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT,
    customer_username NVARCHAR(50),
    employee_username NVARCHAR(50),
    contract_date DATETIME DEFAULT GETDATE(),
    deposit FLOAT,
    total FLOAT,
    payment_method NVARCHAR(50),
    status NVARCHAR(50),

    FOREIGN KEY(order_id) REFERENCES Orders(id),
    FOREIGN KEY(customer_username) REFERENCES Account(username),
    FOREIGN KEY(employee_username) REFERENCES Account(username)
);
-- quản lí khuyến mãi	
CREATE TABLE Promotion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200),
    description NVARCHAR(MAX),
    discount_percent INT,
    start_date DATE,
    end_date DATE,
    status BIT
);
CREATE TABLE PromotionCar(
    promotion_id INT,
    car_id INT,

    PRIMARY KEY(promotion_id,car_id),

    FOREIGN KEY(promotion_id)
    REFERENCES Promotion(id),

    FOREIGN KEY(car_id)
    REFERENCES Car(id)
);
-- quản lí tin tức
CREATE TABLE News(
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(300),
    image NVARCHAR(255),
    summary NVARCHAR(500),
    content NVARCHAR(MAX),
    create_date DATETIME DEFAULT GETDATE(),
    author NVARCHAR(50),

    FOREIGN KEY(author)
    REFERENCES Account(username)
);
-- ===== 3. NHẬP DỮ LIỆU BRAND (HÃNG) =====
INSERT INTO Brand(name) VALUES 
(N'Toyota'),
(N'BMW'),
(N'Mercedes'),
(N'Honda');

-- ===== 4. NHẬP DỮ LIỆU CAR (XE) =====
INSERT INTO Car(name, price, image, description, brand_id, year, color, stock) VALUES
(N'Toyota Camry', 1200000000, 'camry.jpg', N'Sedan cao cấp, an toàn, tiết kiệm xăng', 1, 2023, N'Đen', 8),
(N'BMW X5', 3500000000, 'x5.jpg', N'SUV sang trọng, động cơ mạnh, nội thất cao cấp', 2, 2024, N'Trắng', 5),
(N'Mercedes C300', 2500000000, 'c300.jpg', N'Sedan Đức, công nghệ mới, lái tự động', 3, 2023, N'Xám', 6),
(N'Honda Civic', 900000000, 'civic.jpg', N'Xe thể thao, thiết kế năng động, tiết kiệm', 4, 2022, N'Đỏ', 10),
(N'Toyota Corolla', 800000000, 'corolla.jpg', N'Sedan nhỏ gọn, tin cậy, bảo dưỡng rẻ', 1, 2023, N'Bạc', 9),
(N'BMW 3 Series', 2000000000, 'bmw3.jpg', N'Sedan thể thao, hiệu năng cao, lái cảm giác tuyệt vời', 2, 2024, N'Xanh đen', 4);

-- ===== 5. NHẬP DỮ LIỆU ACCOUNT (TÀI KHOẢN) =====
INSERT INTO Account(username, password, fullname, email, role) VALUES
('admin', '{noop}123', N'Quản trị viên', 'admin@carstore.com', 'ROLE_ADMIN'),
('user1', '{noop}123', N'Nguyễn Văn A', 'user1@carstore.com', 'ROLE_USER'),
('user2', '{noop}123', N'Trần Thị B', 'user2@carstore.com', 'ROLE_USER'),
('user3', '{noop}123', N'Lê Văn C', 'user3@carstore.com', 'ROLE_USER');

-- ===== 6. DỮ LIỆU MẪU SUPPORT / SERVICE =====
INSERT INTO support_request(name, phone, username, type, content, status, car_info, service_type, appointment_date, appointment_time)
VALUES
(N'Nguyễn Văn A', N'0909123456', N'user1', N'service', N'Yêu cầu đặt lịch dịch vụ', N'Chờ xử lý',
 N'51G-123.45 / Ford Ranger', N'Bảo dưỡng định kỳ', '2026-06-25', '09:00'),

(N'Trần Thị B', N'0912345678', N'user2', N'chat', N'Tư vấn thủ tục mua xe trả góp', N'Chờ xử lý',
 NULL, NULL, NULL, NULL);

 -- =========================
-- BÁO GIÁ
-- =========================
INSERT INTO Quotation(customer_username, car_id, car_price, discount, total_price, note, status)
VALUES
('user1',1,850000000,20000000,830000000,N'Khách muốn trả góp',N'Chờ xác nhận'),
('user1',2,1250000000,50000000,1200000000,N'Ưu đãi tháng 7',N'Đã xác nhận');


-- =========================
-- ĐÁNH GIÁ XE
-- =========================
INSERT INTO Review(username,car_id,rating,comment)
VALUES
('user1',1,5,N'Xe đẹp, chạy rất êm'),
('user1',2,4,N'Nội thất đẹp, giá hơi cao'),
('admin',3,5,N'Đáng mua');


-- =========================
-- THANH TOÁN
-- =========================
INSERT INTO Payment(order_id,amount,payment_method,transaction_code,status)
VALUES
(1,50000000,N'VNPay','VNP001',N'Thành công'),
(2,100000000,N'MoMo','MOMO002',N'Thành công');








-- =========================
-- KHUYẾN MÃI
-- =========================
INSERT INTO Promotion(title,description,discount_percent,start_date,end_date,status)VALUES
(N'Khuyến mãi tháng 7',
N'Giảm giá toàn bộ xe Ford',
10,
'2026-07-01',
'2026-07-31',
1),

(N'Ưu đãi khai trương',
N'Tặng bảo hiểm thân vỏ',
15,
'2026-08-01',
'2026-08-31',
1);


-- =========================
-- XE ÁP DỤNG KHUYẾN MÃI
-- =========================
INSERT INTO PromotionCar
VALUES
(1,1),
(1,2),
(2,3);


-- =========================
-- TIN TỨC
-- =========================
INSERT INTO News(
title,
image,
summary,
content,
author)
VALUES
(
N'Ford Ranger 2026 ra mắt',
'ranger2026.jpg',
N'Ford Ranger phiên bản mới',
N'Phiên bản mới có nhiều công nghệ hỗ trợ lái hiện đại...',
'admin'
),

(
N'BMW giảm giá mùa hè',
'bmw-sale.jpg',
N'Ưu đãi lên đến 200 triệu',
N'Chương trình áp dụng đến hết tháng 8...',
'admin'
);
-- =========================
-- ĐƠN HÀNG
-- =========================
INSERT INTO Orders(
    username,
    address,
    registration_address,
    payment_method,
    status
)
VALUES
(
'user1',
N'TP Hồ Chí Minh',
N'TP Hồ Chí Minh',
N'Chuyển khoản',
N'Đã xác nhận'
),

(
'user1',
N'Bình Dương',
N'Bình Dương',
N'Trả góp',
N'Đang xử lý'
);
INSERT INTO OrderDetail(order_id,car_id,price,quantity)
VALUES
(1,1,830000000,1),
(2,2,1200000000,1);
INSERT INTO Contract(
order_id,
customer_username,
employee_username,
deposit,
total,
payment_method,
status)
VALUES
(1,'user1','admin',50000000,830000000,N'Chuyển khoản',N'Đã ký'),
(2,'user1','admin',100000000,1200000000,N'Trả góp',N'Chờ thanh toán');




-- ===== 7. KIỂM TRA DỮ LIỆU =====
PRINT '========================================';
PRINT 'KIỂM TRA DỮ LIỆU ĐÃ NHẬP';
PRINT '========================================';

PRINT '--- Brand (Hãng) ---';
SELECT * FROM Brand;

PRINT '--- Car (Xe) ---';
SELECT * FROM Car;

PRINT '--- Account (Tài khoản) ---';
SELECT * FROM Account;

PRINT '--- Support Request (Hỗ trợ / Dịch vụ) ---';
SELECT * FROM support_request;

PRINT '--- Tóm tắt ---';
SELECT 
    (SELECT COUNT(*) FROM Brand) AS [Số Hãng],
    (SELECT COUNT(*) FROM Car) AS [Số Xe],
    (SELECT COUNT(*) FROM Account) AS [Số Tài khoản],
    (SELECT COUNT(*) FROM support_request) AS [Số Yêu cầu Hỗ trợ];

GO

PRINT 'Setup hoàn thành! ✓';
