using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace CovidAndWeatherVisualization.DataAccess
{
    public class CapstoneDbContext: DbContext
    {
        private DbSet<CovidDataByCountyDto> CovidDataByCounty { get; set; }
        public CapstoneDbContext(DbContextOptions<CapstoneDbContext> options)
            : base(options)
        {
        }

        public CapstoneDbContext()
        {
            
        }

        public virtual async Task<List<CovidDataByCountyDto>> GetCovidDataByCountyOrdered(CovidDataRequest request)
        {
            return await CovidDataByCounty.FromSqlInterpolated($"EXEC Covid.DataByCounty_Ordered_S @StartDate = {request.StartDate.Value}, @EndDate = {request.EndDate.Value}, @Fips = {request.Fips.Value}").ToListAsync();
        }
    }
}
