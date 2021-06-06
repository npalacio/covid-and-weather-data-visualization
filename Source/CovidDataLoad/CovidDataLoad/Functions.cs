using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CovidDataLoad.Interfaces;
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
        public async void Run([TimerTrigger("0 */5 * * * *")] TimerInfo myTimer, ILogger log)
        {
            //log.LogInformation($"DataLoad function started at {DateTime.Now}");
            //var covidData = await _covidRepo.GetCovidCumulativeDataByCounty();
            //log.LogInformation($"Record count: {covidData.Count()}");
            await ReadFromDb(log);
        }

        private async Task ReadFromDb(ILogger log)
        {
            // have to trigger path filter
            var connectionString = Environment.GetEnvironmentVariable("connection-string-db-capstone");
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    conn.Open();
                    var text = "SELECT TOP (1000) [AddressID],[AddressLine1],[AddressLine2],[City],[StateProvince],[CountryRegion],[PostalCode],[rowguid],[ModifiedDate] FROM [SalesLT].[Address]";

                    using (SqlCommand cmd = new SqlCommand(text, conn))
                    {
                        // Execute the command and log the # rows affected.
                        var dataReader = await cmd.ExecuteReaderAsync();
                        DataTable dt = new DataTable();
                        dt.Load(dataReader);
                        int numRows = dt.Rows.Count;
                        log.LogInformation($"{numRows} rows were read");
                    }
                }
            }
            catch (Exception e)
            {
                log.LogError(e.ToString());
                throw e;
            }
        }
    }
}