using System;

namespace CovidAndWeatherVisualization.Core.Entities
{
    public class CovidDataRequestEntity
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Fips { get; set; }
    }
}