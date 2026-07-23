USE CarStore;
GO

-- Chỉ lập chỉ mục trên các cột thực sự tồn tại trong schema CarStore.
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Car_BrandPrice' AND object_id=OBJECT_ID('dbo.Car'))
    CREATE INDEX IX_Car_BrandPrice ON dbo.Car(brand_id, price);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Orders_UserStatusCreated' AND object_id=OBJECT_ID('dbo.Orders'))
    CREATE INDEX IX_Orders_UserStatusCreated ON dbo.Orders(username, status, create_date DESC);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_Review_UserCar' AND object_id=OBJECT_ID('dbo.Review'))
    CREATE UNIQUE INDEX UX_Review_UserCar ON dbo.Review(username, car_id)
    WHERE username IS NOT NULL AND car_id IS NOT NULL;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Quotation_CustomerStatus' AND object_id=OBJECT_ID('dbo.Quotation'))
    CREATE INDEX IX_Quotation_CustomerStatus ON dbo.Quotation(customer_username, status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Payment_OrderTransaction' AND object_id=OBJECT_ID('dbo.Payment'))
    CREATE INDEX IX_Payment_OrderTransaction ON dbo.Payment(order_id, transaction_code);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_PaymentTransaction_OrderNo' AND object_id=OBJECT_ID('dbo.PaymentTransaction'))
    CREATE INDEX IX_PaymentTransaction_OrderNo ON dbo.PaymentTransaction(order_id, transaction_no);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Promotion_CodeStatus' AND object_id=OBJECT_ID('dbo.Promotion'))
    CREATE INDEX IX_Promotion_CodeStatus ON dbo.Promotion(code, status);

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_News_Slug' AND object_id=OBJECT_ID('dbo.News'))
    CREATE UNIQUE INDEX UX_News_Slug ON dbo.News(slug) WHERE slug IS NOT NULL;
GO
