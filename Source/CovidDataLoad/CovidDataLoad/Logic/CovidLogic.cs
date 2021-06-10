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

namespace CovidDataLoad.Logic
{
    public class CovidLogic : ICovidLogic
    {
        private readonly string csvUri = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
        private readonly HttpClient _httpClient;
        private readonly CapstoneDbContext _dbContext;
        private readonly ILogger<CovidLogic> _log;
        private const int BATCH_SIZE = 10000;

        public CovidLogic(HttpClient httpClient, CapstoneDbContext dbContext, ILogger<CovidLogic> log)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
            _log = log;
        }

        public async Task RefreshCovidData()
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

                    _log.LogInformation($"Beginning batches of size {BATCH_SIZE}...");
                    var bucketsCompleted = 0;
                    foreach (var batch in covidData.Batch(BATCH_SIZE))
                    {
                        _dbContext.SaveCovidData(batch);
                        _log.LogInformation($"Finished loading bucket {++bucketsCompleted}");
                    }

                    transactionScope.Complete();
                    _log.LogInformation($"Done loading all buckets");
                }
            }
            _dbContext.MergeCovidTables();
        }
    }
}