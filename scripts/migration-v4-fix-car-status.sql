USE CarStore;
GO

IF COL_LENGTH('dbo.Car', 'status') IS NULL
BEGIN
    ALTER TABLE dbo.Car
    ADD status NVARCHAR(20) NOT NULL
        CONSTRAINT DF_Car_Status DEFAULT 'AVAILABLE';
END;
GO

UPDATE dbo.Car
SET status = 'AVAILABLE'
WHERE status IS NULL
   OR status NOT IN ('AVAILABLE', 'DEPOSITED', 'SOLD', 'INACTIVE');
GO

IF NOT EXISTS (
    SELECT 1
    FROM sys.check_constraints
    WHERE name = 'CK_Car_Status'
      AND parent_object_id = OBJECT_ID('dbo.Car')
)
BEGIN
    ALTER TABLE dbo.Car WITH CHECK
    ADD CONSTRAINT CK_Car_Status
        CHECK (status IN ('AVAILABLE', 'DEPOSITED', 'SOLD', 'INACTIVE'));

    ALTER TABLE dbo.Car CHECK CONSTRAINT CK_Car_Status;
END;
GO
