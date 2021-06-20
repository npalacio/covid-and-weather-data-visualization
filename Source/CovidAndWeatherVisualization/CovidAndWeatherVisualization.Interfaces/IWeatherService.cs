using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Models;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface IWeatherService
    {
        Task<List<TemperatureData>> GetTemperatureData(WeatherDataRequest request);
    }
}