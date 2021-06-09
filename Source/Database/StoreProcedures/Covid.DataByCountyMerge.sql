CREATE OR ALTER PROCEDURE [Covid].[DataByCountyMerge]
	@CovidDataByCounty Covid.TVP_DataByCounty READONLY
AS
	BEGIN
		INSERT INTO Covid.DataByCountyEtl
		(
			Date
		  , County
		  , State
		  , FIPS
		  , Cases
		  , Deaths
		)
		SELECT Date
			 , County
			 , State
			 , FIPS
			 , Cases
			 , Deaths
		FROM @CovidDataByCounty ;
	END ;
