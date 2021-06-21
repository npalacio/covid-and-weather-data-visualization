using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Enums;
using CovidAndWeatherVisualization.Interfaces;
using Newtonsoft.Json;

namespace CovidAndWeatherVisualization.DataAccess
{
    public class WeatherSourceServiceAgent : IWeatherSourceServiceAgent
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public WeatherSourceServiceAgent(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<List<WeatherDataEntity>> GetWeatherData(WeatherDataRequestEntity request)
        {
            using (var weatherSourceClient = _httpClientFactory.CreateClient(HttpClientEnum.WeatherSource.ToString()))
            {
                var requestUrl =
                    $"points/{request.Latitude},{request.Longitude}/history.json?timestamp_between={request.StartDate.ToString("s", System.Globalization.CultureInfo.InvariantCulture)},{request.EndDate.ToString("s", System.Globalization.CultureInfo.InvariantCulture)}&fields=tempAvg";
                var response = await weatherSourceClient.GetAsync(requestUrl);

                if(response.StatusCode == HttpStatusCode.NotFound) return new List<WeatherDataEntity>();

                response.EnsureSuccessStatusCode();
                return JsonConvert.DeserializeObject<List<WeatherDataEntity>>(await response.Content.ReadAsStringAsync());
            }
        }
    }
}