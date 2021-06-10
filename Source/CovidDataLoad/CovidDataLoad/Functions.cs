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
        private readonly ICovidLogic _covidLogic;

        public Functions(ICovidLogic covidLogic)
        {
            _covidLogic = covidLogic;
        }

        //public async void Run([TimerTrigger("0 12 * * *")] TimerInfo myTimer, ILogger log)
        [FunctionName("DataLoad")]
        public async Task Run([TimerTrigger("* */30 * * * *")] TimerInfo myTimer, ILogger log)
        {
            try
            {
                log.LogInformation($"DataLoad function started at {DateTime.Now}");
                log.LogInformation($"Refreshing Covid data...");
                await _covidLogic.RefreshCovidData();
                log.LogInformation($"Successfully refreshed Covid data");
            }
            catch (Exception e)
            {
                log.LogError(e.ToString());
                throw;
            }
        }
    }
}