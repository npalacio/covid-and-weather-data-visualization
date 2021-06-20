using System;
using System.IO;
using CovidAndWeatherVisualization.Core;
using CovidAndWeatherVisualization.DataAccess;
using CovidAndWeatherVisualization.Interfaces;
using CovidAndWeatherVisualization.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CovidAndWeatherVisualization
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var secretConfig = GetSecretConfig();
            var capstoneDbConnectionString = secretConfig.GetValue<string>("connection-string-db-capstone") ?? Environment.GetEnvironmentVariable("connection-string-db-capstone");
            var weatherSourceApiKey = secretConfig.GetValue<string>("weather-source-api-key") ?? Environment.GetEnvironmentVariable("weather-source-api-key");

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddApplicationInsightsTelemetry();
            services.AddTransient<ICovidService, CovidService>();
            services.AddTransient<IWeatherService, WeatherService>();
            services.AddDbContext<CapstoneDbContext>(options => options.UseSqlServer(capstoneDbConnectionString, o =>
            {
                o.EnableRetryOnFailure();
            }));
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.AddHttpClient(Enums.HttpClients.WeatherSource.ToString(), c =>
            {
                c.BaseAddress = new Uri($"https://api.weathersource.com/v1/{weatherSourceApiKey}/");
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501
                spa.Options.SourcePath = "ClientApp";
            });
        }
        private static IConfigurationRoot GetSecretConfig()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(AppContext.BaseDirectory))
                .AddJsonFile("secretSettings.json", true);

            var config = builder.Build();
            return config;
        }

    }
}
