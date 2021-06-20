using System;
using System.ComponentModel.DataAnnotations;

namespace CovidAndWeatherVisualization.Core.Models
{
    public class WeatherDataRequest
    {
        [Required]
        public DateTime? StartDate { get; set; }
        [Required]
        public DateTime? EndDate { get; set; }
        [Required]
        public double? Latitude { get; set; }
        [Required]
        public double? Longitude { get; set; }
    }
}