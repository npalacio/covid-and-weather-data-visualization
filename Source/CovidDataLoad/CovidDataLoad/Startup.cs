using System;
using CovidDataLoad.DataAccess;
using CovidDataLoad.Interfaces;
using CovidDataLoad.Logic;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(CovidDataLoad.Startup))]

namespace CovidDataLoad
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();
            builder.Services.AddLogging();
            builder.Services.AddScoped<ICovidLogic, CovidLogic>();
            builder.Services.AddDbContext<CapstoneDbContext>(options => options.UseSqlServer(Environment.GetEnvironmentVariable("connection-string-db-capstone"), o =>
            {
                o.EnableRetryOnFailure(5, TimeSpan.FromSeconds(30), null);
                o.CommandTimeout(5 * 60);
            }));
        }
    }
}