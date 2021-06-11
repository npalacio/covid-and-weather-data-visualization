using System;

namespace CovidAndWeatherVisualization.Core.Models
{
    public class CovidDataByCounty
    {
        public DateTime Date { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        public int? Fips { get; set; }
        public int Cases { get; set; }
    }
}