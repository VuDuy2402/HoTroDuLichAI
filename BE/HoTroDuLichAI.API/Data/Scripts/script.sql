



GO


DECLARE @ItineraryId UNIQUEIDENTIFIER;
DECLARE @PlaceId UNIQUEIDENTIFIER;
DECLARE @BusinessId UNIQUEIDENTIFIER;
DECLARE @BusinessServiceIds NVARCHAR(MAX);
DECLARE @Index INT = 1;

DECLARE business_cursor CURSOR FOR
SELECT Id
FROM Business_Business;

OPEN business_cursor;

FETCH NEXT FROM business_cursor INTO @BusinessId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @BusinessServiceIds = (
        SELECT STRING_AGG('"' + CAST(ServiceId AS NVARCHAR(36)) + '"', ',')
        FROM OPENJSON(
            (SELECT Service FROM Business_Business WHERE Id = @BusinessId)
        ) 
        WITH (
            ServiceId UNIQUEIDENTIFIER '$.ServiceId'
        )
    );

    SET @ItineraryId = (
        SELECT TOP 1 Id
        FROM Customer_Itinerary
        ORDER BY NEWID()
    );

    SET @PlaceId = (
        SELECT TOP 1 Id
        FROM Admin_Place
        ORDER BY NEWID()
    );

    WHILE @Index <= 7
    BEGIN
        INSERT INTO Customer_ItineraryDetail ("Id", "BusinessId", "ItineraryId", "PlaceId", "BusinessServiceIds", "Index", "Time", "CreatedDate")
        VALUES (
			NEWID(),
            @BusinessId,
            @ItineraryId,
            @PlaceId,
            '[' + @BusinessServiceIds + ']',
            @Index,
            '12:00',
            GETDATE()
        );
        SET @Index = @Index + 1;
    END;

    SET @Index = 1;

    FETCH NEXT FROM business_cursor INTO @BusinessId;
END;

CLOSE business_cursor;
DEALLOCATE business_cursor;


SELECT * FROM "Customer_ItineraryDetail"