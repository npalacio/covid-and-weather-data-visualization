using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CovidDataLoad.Models;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlClient.Server;
using Microsoft.EntityFrameworkCore;

namespace CovidDataLoad.DataAccess
{
    public class CapstoneDbContext : DbContext
    {
        public CapstoneDbContext(DbContextOptions<CapstoneDbContext> options)
            : base(options)
        {
        }

        public void SaveCovidData(IEnumerable<CovidCumulativeByCounty> covidData)
        {
            var tvp = GetTvpParam(covidData);
            Database.ExecuteSqlRaw($"EXEC [Covid].[DataByCountyInsertEtl] @CovidDataByCounty=@{tvp.ParameterName}", tvp);
        }

        public void ClearCovidEtlTable()
        {
            Database.ExecuteSqlRaw($"TRUNCATE TABLE [Covid].[DataByCountyEtl]");
        }

        public void MergeCovidTables()
        {
            Database.ExecuteSqlRaw($"EXEC [Covid].[DataByCountyMerge]");
        }

        private SqlParameter GetTvpParam(IEnumerable<CovidCumulativeByCounty> covidData)
        {
            var tvpBuilder = new TvpBuilder("Covid.TVP_DataByCounty",
                new SqlMetaData("Date", SqlDbType.Date),
                new SqlMetaData("County", SqlDbType.NVarChar, 60),
                new SqlMetaData("State", SqlDbType.NVarChar, 60),
                new SqlMetaData("FIPS", SqlDbType.Int),
                new SqlMetaData("Cases", SqlDbType.Int),
                new SqlMetaData("Deaths", SqlDbType.Int));
            foreach (var dataPoint in covidData)
            {
                tvpBuilder.AddRow(
                    dataPoint.Date,
                    dataPoint.County,
                    dataPoint.State,
                    dataPoint.Fips,
                    dataPoint.Cases,
                    dataPoint.Deaths);
            }

            return tvpBuilder.CreateParameter("p0");

        }
    }
}