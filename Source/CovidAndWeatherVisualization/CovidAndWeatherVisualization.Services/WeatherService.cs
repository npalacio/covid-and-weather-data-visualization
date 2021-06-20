﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.Services
{
    public class WeatherService : IWeatherService
    {
        private readonly IMapper _mapper;
        private readonly IWeatherSourceServiceAgent _weatherSourceServiceAgent;

        public WeatherService(IMapper mapper, IWeatherSourceServiceAgent weatherSourceServiceAgent)
        {
            _mapper = mapper;
            _weatherSourceServiceAgent = weatherSourceServiceAgent;
        }

        public async Task<List<TemperatureData>> GetTemperatureData(WeatherDataRequestEntity request)
        {
            // WeatherSource API has a limit of 1 year for the date range
            var currentStartDate = request.StartDate;
            var currentEndDate = GetCurrentEndDate(currentStartDate, request.EndDate);
            var returnList = new List<TemperatureData>();
            while (currentEndDate > currentStartDate)
            {
                var tempDataEntities = await _weatherSourceServiceAgent.GetTemperatureData(new WeatherDataRequest
                {
                    StartDate = currentStartDate,
                    EndDate = currentEndDate,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude
                });
                returnList.AddRange(_mapper.Map<List<TemperatureData>>(tempDataEntities));
                currentStartDate = currentEndDate.AddDays(1);
                currentEndDate = GetCurrentEndDate(currentStartDate, request.EndDate);
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

    }
}