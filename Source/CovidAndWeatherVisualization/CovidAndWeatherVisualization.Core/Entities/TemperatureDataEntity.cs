using System;

namespace CovidAndWeatherVisualization.Core.Entities
{
    public class TemperatureDataEntity
    {
        public DateTime Timestamp { get; set; }
        public decimal TempAvg { get; set; }
    }
}