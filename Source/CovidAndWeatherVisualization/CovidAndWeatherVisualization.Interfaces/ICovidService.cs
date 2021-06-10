using System.Collections.Generic;
using CovidAndWeatherVisualization.Core.Models;

namespace CovidAndWeatherVisualization.Interfaces
{
    public interface ICovidService
    {
        List<CovidDataByCounty> GetCovidDataByCounty();
    }
}