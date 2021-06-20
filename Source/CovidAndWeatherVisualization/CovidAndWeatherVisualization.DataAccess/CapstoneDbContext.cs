using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CovidAndWeatherVisualization.DataAccess
{
    public class CapstoneDbContext: DbContext
    {
        private DbSet<CovidDataByCountyEntity> CovidDataByCounty { get; set; }
        public CapstoneDbContext(DbContextOptions<CapstoneDbContext> options)
            : base(options)
        {
        }

        public CapstoneDbContext()
        {
        }

        public virtual async Task<List<CovidDataByCountyEntity>> GetCovidDataByCountyOrdered(CovidDataRequestEntity request)
        {
            return await CovidDataByCounty.FromSqlInterpolated($"EXEC Covid.DataByCounty_Ordered_S @StartDate = {request.StartDate}, @EndDate = {request.EndDate}, @Fips = {request.Fips}").ToListAsync();
        }
    }
}
