using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface IWeatherService
    {
        Task<List<TemperatureData>> GetTemperatureData(WeatherDataRequest request);
    }
}