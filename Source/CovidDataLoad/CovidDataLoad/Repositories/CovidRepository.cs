using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using CovidDataLoad.Interfaces;
using CovidDataLoad.Models;
using CsvHelper;

namespace CovidDataLoad.Repositories
{
    public class CovidRepository : ICovidRepository
    {
        private readonly string csvUri = "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
        private readonly HttpClient _httpClient;

        public CovidRepository(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<CovidCumulativeByCounty>> GetCovidCumulativeDataByCounty()
        {
            List<CovidCumulativeByCounty> covidData;
            var response = await _httpClient.GetAsync(csvUri);
            using (var stream = await response.Content.ReadAsStreamAsync())
            using (var streamReader = new StreamReader(stream))
            using (var csv = new CsvReader(streamReader, CultureInfo.InvariantCulture))
            {
                covidData = csv.GetRecords<CovidCumulativeByCounty>().ToList();
            }

            return covidData;
        }
    }
}