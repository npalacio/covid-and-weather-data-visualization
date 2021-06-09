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
        private DbSet<Address> Addresses { get; set; }

        public async Task<List<Address>> GetAddresses()
        {
            return await Addresses.FromSqlRaw("SELECT [AddressID],[AddressLine1],[PostalCode],[ModifiedDate] FROM [SalesLT].[Address]").ToListAsync();
        }

        public void SaveCovidData(List<CovidCumulativeByCounty> covidData)
        {
            var tvp = GetTvpParam(covidData);
            Database.ExecuteSqlRaw($"EXEC [Covid].[DataByCountyMerge] @CovidDataByCounty=@{tvp.ParameterName}", tvp);

        }

        private SqlParameter GetTvpParam(List<CovidCumulativeByCounty> covidData)
        {
            var tvpBuilder = new TvpBuilder("Patronage.TVP_LoanExclusionResult",
                new SqlMetaData("Date", SqlDbType.Date),
                new SqlMetaData("County", SqlDbType.NVarChar),
                new SqlMetaData("State", SqlDbType.NVarChar),
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