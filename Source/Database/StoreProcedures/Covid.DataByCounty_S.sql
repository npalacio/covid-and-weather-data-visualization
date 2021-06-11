CREATE PROCEDURE [Covid].[DataByCounty_S]
AS
	SELECT TOP 10
		   DataByCountyID
		 , Date
		 , County
		 , State
		 , FIPS
		 , Cases
	FROM Covid.DataByCounty ;
GO


