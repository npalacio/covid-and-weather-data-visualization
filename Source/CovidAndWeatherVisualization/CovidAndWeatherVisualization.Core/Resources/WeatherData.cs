using System;

namespace CovidAndWeatherVisualization.Core.Resources
{
    public class WeatherData
    {
        public DateTime Date { get; set; }
        public decimal TemperatureAverage { get; set; }
        public decimal HumidityRelativeAverage { get; set; }
        public decimal HumiditySpecificAverage { get; set; }
    }
}