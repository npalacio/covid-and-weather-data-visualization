using System;

namespace CovidAndWeatherVisualization.Core.Entities
{
    public class WeatherDataRequestEntity
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}