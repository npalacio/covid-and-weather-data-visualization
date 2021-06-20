using System;
using System.ComponentModel.DataAnnotations;

namespace CovidAndWeatherVisualization.Core.Requests
{
    public class WeatherDataRequestEntity
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}