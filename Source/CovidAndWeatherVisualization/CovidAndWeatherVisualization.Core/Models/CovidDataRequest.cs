﻿using System;
using System.ComponentModel.DataAnnotations;

namespace CovidAndWeatherVisualization.Core.Models
{
    public class CovidDataRequest
    {
        [Required]
        public DateTime? StartDate { get; set; }
        [Required]
        public DateTime? EndDate { get; set; }
        [Required]
        public int? Fips { get; set; }
    }
}