using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Transactions;
using CovidDataLoad.DataAccess;
using CovidDataLoad.Interfaces;
using CovidDataLoad.Models;
using CsvHelper;
using Microsoft.Extensions.Logging;
using MoreLinq;

namespace CovidDataLoad.Repositories
{
    public class CovidRepository : ICovidRepository
    {
        private readonly string csvUri = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
        private readonly HttpClient _httpClient;
        private readonly CapstoneDbContext _dbContext;
        private readonly ILogger<CovidRepository> _log;

        public CovidRepository(HttpClient httpClient, CapstoneDbContext dbContext, ILogger<CovidRepository> log)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
            _log = log;
        }

        public async Task GetCovidCumulativeDataByCounty()
        {
            using (HttpResponseMessage response = await _httpClient.GetAsync(csvUri, HttpCompletionOption.ResponseHeadersRead))
            using (var stream = await response.Content.ReadAsStreamAsync())
            using (var streamReader = new StreamReader(stream))
            using (var csv = new CsvReader(streamReader, CultureInfo.InvariantCulture))
            {
                using (var transactionScope = new TransactionScope(TransactionScopeOption.Required, TimeSpan.FromMinutes(5)))
                {
                    _log.LogInformation($"Clearing ETL table...");
                    _dbContext.ClearCovidEtlTable();
                    _log.LogInformation($"Fetching covid data...");
                    var covidData = csv.GetRecords<CovidCumulativeByCounty>();
                    _log.LogInformation($"Beginning batches...");
                    var bucketsCompleted = 0;
                    foreach (var batch in covidData.Batch(10000))
                    {
                        _dbContext.SaveCovidData(batch);
                        _log.LogInformation($"Finished loading bucket {++bucketsCompleted}");
                    }
                    transactionScope.Complete();
                    _log.LogInformation($"Done loading all buckets");
                }
            }

        }

        public void SaveCovidCumulativeDataByCounty(List<CovidCumulativeByCounty> covidData)
        {
            using (var transactionScope = new TransactionScope())
            {
                try
                {
                    _dbContext.ClearCovidEtlTable();
                    _dbContext.SaveCovidData(covidData);
                    transactionScope.Complete();
                }
                catch (Exception e)
                {
                    _log.LogError("Something went wrong saving Covid data to DB...");
                    throw;
                }
            }
        }
    }
}