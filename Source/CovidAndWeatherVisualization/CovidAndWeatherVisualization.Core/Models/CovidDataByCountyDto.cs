﻿using System;
using System.ComponentModel.DataAnnotations;

namespace CovidAndWeatherVisualization.Core.Models
{
    public class CovidDataByCountyDto
    {
        [Key]
        public int DataByCountyID { get; set; }
        public DateTime Date { get; set; }
        public string County { get; set; }
        public string State { get; set; }
        public int? Fips { get; set; }
        public int CasesCumulative { get; set; }
    }
}