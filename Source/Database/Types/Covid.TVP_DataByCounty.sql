CREATE TYPE [Covid].[TVP_DataByCounty] AS TABLE
(
	[Date] [DATE] NOT NULL,
	[County] [NVARCHAR](60) NOT NULL,
	[State] [NVARCHAR](60) NOT NULL,
	[FIPS] [INT] NULL,
	[Cases] [INT] NOT NULL,
	[Deaths] [INT] NULL
)
GO
