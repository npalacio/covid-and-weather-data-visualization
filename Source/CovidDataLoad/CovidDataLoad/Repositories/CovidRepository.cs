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

namespace CovidDataLoad.Repositories
{
    public class CovidRepository : ICovidRepository
    {
        private readonly string csvUri = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
        private readonly HttpClient _httpClient;
        private readonly CapstoneDbContext _dbContext;
        private readonly ILogger _log;

        public CovidRepository(HttpClient httpClient, CapstoneDbContext dbContext, ILogger log)
        {
            _httpClient = httpClient;
            _dbContext = dbContext;
            _log = log;
        }

        public async Task<List<CovidCumulativeByCounty>> GetCovidCumulativeDataByCounty()
        {
            List<CovidCumulativeByCounty> covidData;
            var response = await _httpClient.GetAsync(csvUri);
            using (var stream = await response.Content.ReadAsStreamAsync())
            using (var streamReader = new StreamReader(stream))
            using (var csv = new CsvReader(streamReader, CultureInfo.InvariantCulture))
            {
                //covidData = csv.GetRecords<CovidCumulativeByCounty>().ToList();
                covidData = csv.GetRecords<CovidCumulativeByCounty>().Take(10).ToList();
            }

            return covidData;
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