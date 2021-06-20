using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;
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
            // WeatherSource API has a limit of 1 year for the date range
            var weatherSourceClient = _httpClientFactory.CreateClient(Enums.HttpClients.WeatherSource.ToString());
            var currentStartDate = request.StartDate.Value;
            var currentEndDate = GetCurrentEndDate(currentStartDate, request.EndDate.Value);
            var returnList = new List<TemperatureData>();
            while (currentEndDate > currentStartDate)
            {
                returnList.AddRange(await GetTemperatureDataFromWeatherSource(new WeatherDataRequest
                {
                    StartDate = currentStartDate,
                    EndDate = currentEndDate,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude
                }, weatherSourceClient));
                currentStartDate = currentEndDate.AddDays(1);
                currentEndDate = GetCurrentEndDate(currentStartDate, request.EndDate.Value);
            }

            return returnList;
        }

        private DateTime GetCurrentEndDate(DateTime currentStartDate, DateTime requestEndDate)
        {
            if (requestEndDate - currentStartDate > TimeSpan.FromDays(365))
            {
                // Still need to fetch more than 1 years worth of data
                return currentStartDate.AddDays(365);
            }
            else
            {
                return requestEndDate;
            }
        }

        private async Task<List<TemperatureData>> GetTemperatureDataFromWeatherSource(WeatherDataRequest request, HttpClient weatherSourceClient)
        {
            var requestUrl =
                $"points/{request.Latitude},{request.Longitude}/history.json?timestamp_between={request.StartDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)},{request.EndDate.Value.ToString("s", System.Globalization.CultureInfo.InvariantCulture)}&fields=tempAvg";
            var response = await weatherSourceClient.GetAsync(requestUrl);
            response.EnsureSuccessStatusCode();
            var result = JsonConvert.DeserializeObject<List<TemperatureDataEntity>>(await response.Content.ReadAsStringAsync());
            return _mapper.Map<List<TemperatureData>>(result);
        }
    }
}