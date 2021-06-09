using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;
using CovidDataLoad.DataAccess;
using CovidDataLoad.Interfaces;
using CovidDataLoad.Models;
using Microsoft.Azure.WebJobs;
using Microsoft.Data.SqlClient;
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

        //public async void Run([TimerTrigger("0 12 * * *")] TimerInfo myTimer, ILogger log)
        [FunctionName("DataLoad")]
        public async Task Run([TimerTrigger("* */1 * * * *")] TimerInfo myTimer, ILogger log)
        {
            try
            {
                log.LogInformation($"DataLoad function started at {DateTime.Now}");
                log.LogInformation($"Fetching Covid data...");
                var covidData = await _covidRepo.GetCovidCumulativeDataByCounty();
                log.LogInformation($"Covid records retrieved: {covidData.Count()}");
                log.LogInformation($"Saving Covid data to DB...");
                _covidRepo.SaveCovidCumulativeDataByCounty(covidData);
            }
            catch (Exception e)
            {
                log.LogError(e.ToString());
                throw;
            }
        }
    }
}