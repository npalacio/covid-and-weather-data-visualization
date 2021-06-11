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

        public async Task<List<CovidDataByCountyDto>> GetCovidDataByCounty()
        {
            return await CovidDataByCounty.FromSqlInterpolated($"EXEC Covid.DataByCounty_S").ToListAsync();
        }
    }
}
