CREATE PROCEDURE [Covid].[DataByCounty_S]
	@StartDate DATE
  , @EndDate DATE
  , @Fips INT
AS
	SELECT DataByCountyID
		 , Date
		 , County
		 , State
		 , FIPS
		 , Cases
	FROM Covid.DataByCounty
	WHERE
		Date >= @StartDate
		AND Date <= @EndDate
		AND FIPS = @Fips
	ORDER BY
		Date ASC ;
GO


