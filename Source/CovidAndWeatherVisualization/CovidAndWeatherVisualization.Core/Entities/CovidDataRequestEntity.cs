using System;
using System.ComponentModel.DataAnnotations;

namespace CovidAndWeatherVisualization.Core.Requests
{
    public class CovidDataRequestEntity
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Fips { get; set; }
    }
}