﻿using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface IWeatherSourceServiceAgent
    {
        Task<List<TemperatureDataEntity>> GetTemperatureData(WeatherDataRequestEntity request);
    }
}