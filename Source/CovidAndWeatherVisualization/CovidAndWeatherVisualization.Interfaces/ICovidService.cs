using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Models;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface ICovidService
    {
        Task<List<CovidDataByCounty>> GetCovidDataByCounty();
    }
}