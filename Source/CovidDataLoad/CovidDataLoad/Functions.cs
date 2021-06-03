using System;
using System.Linq;
using CovidDataLoad.Interfaces;
using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;

namespace CovidDataLoad
{
    public class Functions
    {
        private readonly ICovidRepository _covidRepo;

        public Functions(ICovidRepository covidRepo)
        {
            _covidRepo = covidRepo;
        }

        [FunctionName("DataLoad")]
        public async void Run([TimerTrigger("* * * * *")] TimerInfo myTimer, ILogger log)
        {
            log.LogInformation($"DataLoad function started at {DateTime.Now}");
            var covidData = await _covidRepo.GetCovidCumulativeDataByCounty();
            log.LogInformation($"Record count: {covidData.Count()}");
        }
    }
}