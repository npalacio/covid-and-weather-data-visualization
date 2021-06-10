using System;
using System.Collections.Generic;
using CovidAndWeatherVisualization.Core.Models;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.Services
{
    public class CovidService : ICovidService
    {
        public List<CovidDataByCounty> GetCovidDataByCounty()
        {
            return new List<CovidDataByCounty>
            {
                new CovidDataByCounty
                {
                    Date = DateTime.Now,
                    State = "test state",
                    County = "test county",
                    Fips = 1,
                    Cases = 2
                }
            };
        }
    }
}
