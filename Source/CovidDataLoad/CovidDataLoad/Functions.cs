using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CovidDataLoad.DataAccess;
using CovidDataLoad.Interfaces;
using Microsoft.Azure.WebJobs;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace CovidDataLoad
{
    public class Functions
    {
        private readonly ICovidRepository _covidRepo;
        private readonly CapstoneDbContext _dbContext;

        public Functions(ICovidRepository covidRepo, CapstoneDbContext dbContext)
        {
            _covidRepo = covidRepo;
            _dbContext = dbContext;
        }

        //public async void Run([TimerTrigger("0 12 * * *")] TimerInfo myTimer, ILogger log)
        [FunctionName("DataLoad")]
        public async void Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
        {
            //log.LogInformation($"DataLoad function started at {DateTime.Now}");
            //var covidData = await _covidRepo.GetCovidCumulativeDataByCounty();
            //log.LogInformation($"Record count: {covidData.Count()}");
            ReadFromDb(log);
        }

        private void ReadFromDb(ILogger log)
        {
            try
            {
                var addresses = _dbContext.GetAddresses();
                log.LogInformation($"{addresses.Count} rows were read");
            }
            catch (Exception e)
            {
                log.LogError(e.ToString());
                throw e;
            }
        }
    }
}