CREATE PROCEDURE [Covid].[DataByCounty_Ordered_S]
	@StartDate DATE
  , @EndDate DATE
  , @Fips INT
AS
	SELECT DataByCountyID
		 , Date
		 , County
		 , State
		 , FIPS
		 , Cases AS CasesCumulative
	FROM Covid.DataByCounty
	WHERE
		Date >= @StartDate
		AND Date <= @EndDate
		AND FIPS = @Fips
	ORDER BY
		Date ASC ;
GO

