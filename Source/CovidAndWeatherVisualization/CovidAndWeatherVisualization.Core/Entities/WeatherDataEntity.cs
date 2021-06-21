using System;

namespace CovidAndWeatherVisualization.Core.Entities
{
    public class WeatherDataEntity
    {
        public DateTime Timestamp { get; set; }
        public decimal TempAvg { get; set; }
    }
}