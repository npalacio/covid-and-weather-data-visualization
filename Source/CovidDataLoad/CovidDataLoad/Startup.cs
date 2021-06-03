using CovidDataLoad.Interfaces;
using CovidDataLoad.Repositories;
using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(CovidDataLoad.Startup))]

namespace CovidDataLoad
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            builder.Services.AddHttpClient();

            builder.Services.AddSingleton<ICovidRepository, CovidRepository>();
        }
    }
}