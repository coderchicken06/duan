USE CarStore;
GO

IF COL_LENGTH('Car', 'stock') IS NULL
BEGIN
    ALTER TABLE Car ADD stock INT NOT NULL CONSTRAINT DF_Car_stock DEFAULT 0;
END
GO

UPDATE Car
SET stock = 0
WHERE stock IS NULL;
GO

SELECT id, name, stock FROM Car;
GO
