CREATE   PROCEDURE [Covid].[DataByCountyMerge]
AS
	MERGE Covid.DataByCounty AS myTarget
	USING
	(
		SELECT Date
			 , County
			 , State
			 , FIPS
			 , Cases
			 , Deaths
		FROM Covid.DataByCountyEtl
	) AS mySource
	ON myTarget.Date = mySource.Date
	   AND myTarget.State = mySource.State
	   AND myTarget.County = mySource.County
	WHEN MATCHED THEN UPDATE SET myTarget.FIPS = mySource.FIPS
							   , myTarget.Cases = mySource.Cases
							   , myTarget.Deaths = mySource.Deaths
							   , myTarget.UpdatedOnUtc = SYSDATETIMEOFFSET ()
	WHEN NOT MATCHED THEN INSERT
						  (
							  Date
							, County
							, State
							, FIPS
							, Cases
							, Deaths
							, UpdatedOnUtc
							, CreatedOnUtc
						  )
						  VALUES
							  (mySource.Date, mySource.County, mySource.State, mySource.FIPS, mySource.Cases, mySource.Deaths, SYSDATETIMEOFFSET (), SYSDATETIMEOFFSET ())
	WHEN NOT MATCHED BY SOURCE THEN DELETE ;

GO


