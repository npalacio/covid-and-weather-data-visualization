using System;
using System.Threading.Tasks;
using CovidDataLoad.Interfaces;
using Microsoft.Azure.WebJobs;
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

        [FunctionName("DataLoad")]
        public async Task Run([TimerTrigger("0 0 12 * * *")] TimerInfo myTimer, ILogger log)
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