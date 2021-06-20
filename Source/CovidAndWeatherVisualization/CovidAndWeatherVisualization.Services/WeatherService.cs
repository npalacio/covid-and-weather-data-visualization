using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Models;
using CovidAndWeatherVisualization.Interfaces;
using Newtonsoft.Json;

namespace CovidAndWeatherVisualization.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IMapper _mapper;

        public WeatherService(IHttpClientFactory httpClientFactory, IMapper mapper)
        {
            _httpClientFactory = httpClientFactory;
            _mapper = mapper;
        }

        public async Task<List<TemperatureData>> GetTemperatureData(WeatherDataRequest request)
        {
            // TODO: have to make multiple requests if over a year timespan
            var weatherSourceClient = _httpClientFactory.CreateClient(Enums.HttpClients.WeatherSource.ToString());
            var requestUrl = $"points/{request.Latitude},{request.Longitude}/history.json?timestamp_between={request.StartDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)},{request.EndDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)}&fields=tempAvg";
            var response = await weatherSourceClient.GetAsync(requestUrl);
            response.EnsureSuccessStatusCode();
            var result = JsonConvert.DeserializeObject<List<TemperatureDataEntity>>(await response.Content.ReadAsStringAsync());
            return _mapper.Map<List<TemperatureData>>(result);
        }
    }
}