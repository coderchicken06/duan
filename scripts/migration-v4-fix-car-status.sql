USE CarStore;
GO

IF COL_LENGTH('dbo.Car', 'status') IS NULL
BEGIN
    ALTER TABLE dbo.Car
    ADD status NVARCHAR(20) NOT NULL
        CONSTRAINT DF_Car_Status DEFAULT 'AVAILABLE';
END;
GO

-- Cap nhat constraint CK_Car_Status hoac chk_car_status
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'CK_Car_Status' AND parent_object_id = OBJECT_ID('dbo.Car'))
BEGIN
    ALTER TABLE dbo.Car DROP CONSTRAINT CK_Car_Status;
END;
GO

IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name = 'chk_car_status' AND parent_object_id = OBJECT_ID('dbo.Car'))
BEGIN
    ALTER TABLE dbo.Car DROP CONSTRAINT chk_car_status;
END;
GO

UPDATE dbo.Car
SET status = 'AVAILABLE'
WHERE status IS NULL
   OR status NOT IN ('AVAILABLE', 'DEPOSITED', 'OUT_OF_STOCK', 'SOLD', 'INACTIVE');
GO

ALTER TABLE dbo.Car WITH CHECK
ADD CONSTRAINT CK_Car_Status
    CHECK (status IN ('AVAILABLE', 'DEPOSITED', 'OUT_OF_STOCK', 'SOLD', 'INACTIVE'));

ALTER TABLE dbo.Car CHECK CONSTRAINT CK_Car_Status;
GO
