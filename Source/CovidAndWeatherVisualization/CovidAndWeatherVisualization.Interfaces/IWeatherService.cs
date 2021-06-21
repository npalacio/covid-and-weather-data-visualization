using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface IWeatherService
    {
        Task<List<WeatherData>> GetWeatherData(WeatherDataRequestEntity request);
    }
}