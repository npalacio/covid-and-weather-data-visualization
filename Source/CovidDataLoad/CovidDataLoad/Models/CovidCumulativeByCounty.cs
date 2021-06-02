using System;
using CsvHelper.Configuration.Attributes;

namespace CovidDataLoad.Models
{
    public class CovidCumulativeByCounty
    {
        [Name("date")]
        public DateTime Date { get; set; }
        [Name("county")]
        public string County { get; set; }
        [Name("state")]
        public string State { get; set; }
        [Name("fips")]
        public int? Fips { get; set; }
        [Name("cases")]
        public int Cases { get; set; }
        [Name("deaths")]
        public int? Deaths { get; set; }
    }
}