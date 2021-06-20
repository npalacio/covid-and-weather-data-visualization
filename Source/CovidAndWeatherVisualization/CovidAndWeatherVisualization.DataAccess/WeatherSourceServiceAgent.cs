using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Enums;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;
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

        public async Task<List<TemperatureDataEntity>> GetTemperatureData(WeatherDataRequest request)
        {
            using (var weatherSourceClient = _httpClientFactory.CreateClient(HttpClientEnum.WeatherSource.ToString()))
            {
                var requestUrl =
                    $"points/{request.Latitude},{request.Longitude}/history.json?timestamp_between={request.StartDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)},{request.EndDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)}&fields=tempAvg";
                var response = await weatherSourceClient.GetAsync(requestUrl);

                if(response.StatusCode == HttpStatusCode.NotFound) return new List<TemperatureDataEntity>();

                response.EnsureSuccessStatusCode();
                return JsonConvert.DeserializeObject<List<TemperatureDataEntity>>(await response.Content.ReadAsStringAsync());
            }
        }
    }
}