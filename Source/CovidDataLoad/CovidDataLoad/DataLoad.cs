using System;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using CovidDataLoad.Models;
using CsvHelper;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Host;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CovidDataLoad
{
    public static class DataLoad
    {
        [FunctionName("DataLoad")]
        public static async void Run([TimerTrigger("* * * * *")]TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");
            var client = new HttpClient();
            var response = await client.GetAsync("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv");
            using (var stream = await response.Content.ReadAsStreamAsync())
            using (var streamReader = new StreamReader(stream))
            using (var csv = new CsvReader(streamReader, CultureInfo.InvariantCulture))
            {
                var records = csv.GetRecords<CovidCumulativeByCounty>();
                log.LogInformation($"Record Count: {records.Count()}");
            }
        }
    }
}
