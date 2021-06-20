using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface IWeatherSourceServiceAgent
    {
        Task<List<TemperatureDataEntity>> GetTemperatureData(WeatherDataRequest request);
    }
}