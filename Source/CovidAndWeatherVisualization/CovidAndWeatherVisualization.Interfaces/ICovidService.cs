using System.Collections.Generic;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface ICovidService
    {
        Task<List<CovidDataByCounty>> GetCovidDataByCounty(CovidDataRequestEntity request);
    }
}