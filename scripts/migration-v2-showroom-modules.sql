USE CarStore;
GO

IF COL_LENGTH('dbo.Quotation','quotation_no') IS NULL ALTER TABLE dbo.Quotation ADD quotation_no NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.Quotation','updated_at') IS NULL ALTER TABLE dbo.Quotation ADD updated_at DATETIME NULL;
IF COL_LENGTH('dbo.Quotation','order_id') IS NULL ALTER TABLE dbo.Quotation ADD order_id INT NULL;
GO

IF OBJECT_ID('dbo.QuotationItem','U') IS NULL
BEGIN
    CREATE TABLE dbo.QuotationItem (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_QuotationItem PRIMARY KEY,
        quotation_id INT NOT NULL,
        car_id INT NOT NULL,
        quantity INT NOT NULL CONSTRAINT DF_QuotationItem_Quantity DEFAULT 1,
        unit_price FLOAT NOT NULL,
        discount FLOAT NOT NULL CONSTRAINT DF_QuotationItem_Discount DEFAULT 0,
        total FLOAT NOT NULL,
        CONSTRAINT FK_QuotationItem_Quotation FOREIGN KEY (quotation_id) REFERENCES dbo.Quotation(id),
        CONSTRAINT FK_QuotationItem_Car FOREIGN KEY (car_id) REFERENCES dbo.Car(id),
        CONSTRAINT CK_QuotationItem_Values CHECK (quantity > 0 AND unit_price >= 0 AND discount >= 0 AND total >= 0)
    );
END
GO

INSERT INTO dbo.QuotationItem(quotation_id,car_id,quantity,unit_price,discount,total)
SELECT q.id,q.car_id,1,q.car_price,q.discount,q.total_price
FROM dbo.Quotation q
WHERE NOT EXISTS (SELECT 1 FROM dbo.QuotationItem qi WHERE qi.quotation_id=q.id);
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_Quotation_Order')
    ALTER TABLE dbo.Quotation ADD CONSTRAINT FK_Quotation_Order FOREIGN KEY(order_id) REFERENCES dbo.Orders(id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_QuotationItem_Quotation' AND object_id=OBJECT_ID('dbo.QuotationItem'))
    CREATE INDEX IX_QuotationItem_Quotation ON dbo.QuotationItem(quotation_id);
GO

IF COL_LENGTH('dbo.Contract','contract_no') IS NULL ALTER TABLE dbo.Contract ADD contract_no NVARCHAR(40) NULL;
IF COL_LENGTH('dbo.Contract','quotation_id') IS NULL ALTER TABLE dbo.Contract ADD quotation_id INT NULL;
IF COL_LENGTH('dbo.Contract','pdf_path') IS NULL ALTER TABLE dbo.Contract ADD pdf_path NVARCHAR(500) NULL;
IF COL_LENGTH('dbo.Contract','signed_at') IS NULL ALTER TABLE dbo.Contract ADD signed_at DATETIME NULL;
IF OBJECT_ID('dbo.PaymentTransaction','U') IS NULL
BEGIN
    CREATE TABLE dbo.PaymentTransaction (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_PaymentTransaction PRIMARY KEY,
        order_id INT NOT NULL,
        gateway NVARCHAR(50) NOT NULL,
        transaction_no NVARCHAR(100) NOT NULL,
        bank_code NVARCHAR(30) NULL,
        amount FLOAT NOT NULL,
        status NVARCHAR(30) NOT NULL,
        response_code NVARCHAR(30) NULL,
        paid_at DATETIME NULL,
        raw_response NVARCHAR(MAX) NULL,
        CONSTRAINT UQ_PaymentTransaction_No UNIQUE(transaction_no),
        CONSTRAINT FK_PaymentTransaction_Order FOREIGN KEY(order_id) REFERENCES dbo.Orders(id),
        CONSTRAINT CK_PaymentTransaction_Amount CHECK(amount>=0)
    );
END
GO

IF COL_LENGTH('dbo.Promotion','code') IS NULL ALTER TABLE dbo.Promotion ADD code NVARCHAR(50) NULL;
IF COL_LENGTH('dbo.Promotion','type') IS NULL ALTER TABLE dbo.Promotion ADD type NVARCHAR(20) NULL;
IF COL_LENGTH('dbo.Promotion','value') IS NULL ALTER TABLE dbo.Promotion ADD value FLOAT NULL;
IF COL_LENGTH('dbo.Promotion','created_at') IS NULL ALTER TABLE dbo.Promotion ADD created_at DATETIME NULL;
IF COL_LENGTH('dbo.News','slug') IS NULL ALTER TABLE dbo.News ADD slug NVARCHAR(320) NULL;
IF COL_LENGTH('dbo.News','status') IS NULL ALTER TABLE dbo.News ADD status NVARCHAR(30) NULL;
IF COL_LENGTH('dbo.News','updated_at') IS NULL ALTER TABLE dbo.News ADD updated_at DATETIME NULL;
GO

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name='FK_Contract_Quotation')
    ALTER TABLE dbo.Contract ADD CONSTRAINT FK_Contract_Quotation FOREIGN KEY(quotation_id) REFERENCES dbo.Quotation(id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Car_Price' AND object_id=OBJECT_ID('dbo.Car'))
    CREATE INDEX IX_Car_Price ON dbo.Car(price);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Quotation_CustomerStatus' AND object_id=OBJECT_ID('dbo.Quotation'))
    CREATE INDEX IX_Quotation_CustomerStatus ON dbo.Quotation(customer_username,status);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_Review_UserCar' AND object_id=OBJECT_ID('dbo.Review'))
    CREATE UNIQUE INDEX UX_Review_UserCar ON dbo.Review(username,car_id) WHERE username IS NOT NULL AND car_id IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Payment_OrderTransaction' AND object_id=OBJECT_ID('dbo.Payment'))
    CREATE INDEX IX_Payment_OrderTransaction ON dbo.Payment(order_id,transaction_code);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='UX_News_Slug' AND object_id=OBJECT_ID('dbo.News'))
    CREATE UNIQUE INDEX UX_News_Slug ON dbo.News(slug) WHERE slug IS NOT NULL;
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Promotion_CodeStatus' AND object_id=OBJECT_ID('dbo.Promotion'))
    CREATE INDEX IX_Promotion_CodeStatus ON dbo.Promotion(code,status);
GO
